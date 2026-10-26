package ac.za.mycput.service;

import ac.za.mycput.domain.*;
import ac.za.mycput.dto.OrderSummary;
import ac.za.mycput.repository.OrderRepository;
import ac.za.mycput.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class StorefrontCheckoutService {
    public record Line(Long productId, int quantity) { }
    public record Request(UUID requestId, List<Line> items, CheckoutDetails details, BigDecimal expectedTotal) { }

    private final OrderRepository orders;
    private final ProductRepository products;

    public StorefrontCheckoutService(OrderRepository orders, ProductRepository products) {
        this.orders = orders;
        this.products = products;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public OrderSummary place(Request request) {
        return place(request, null);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public OrderSummary place(Request request, Customer customer) {
        if (request == null || request.requestId() == null || request.details() == null
                || request.items() == null || request.items().isEmpty() || request.items().size() > 100
                || request.expectedTotal() == null || request.expectedTotal().signum() < 0) {
            throw badRequest("Complete your details and add an item to your bag.");
        }
        CheckoutDetails details = normalize(request.details());
        var quantities = new TreeMap<Long, Integer>();
        for (Line line : request.items()) {
            if (line == null || line.productId() == null || line.productId() < 1
                    || line.quantity() < 1 || line.quantity() > 99
                    || quantities.putIfAbsent(line.productId(), line.quantity()) != null) {
                throw badRequest("Check the items and quantities in your bag.");
            }
        }
        String reference = request.requestId().toString();
        var previous = orders.findByCheckoutReference(reference);
        if (previous.isPresent()) return OrderSummary.from(previous.get());

        // Lock in ID order so concurrent checkouts cannot sell the same stock twice.
        List<Product> selected = new ArrayList<>();
        for (Long id : quantities.keySet()) {
            selected.add(products.findForCheckout(id).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.CONFLICT, "An item is no longer available. Review your bag.")));
        }
        // A concurrent retry may have finished while waiting for the product locks.
        previous = orders.findByCheckoutReference(reference);
        if (previous.isPresent()) return OrderSummary.from(previous.get());

        BigDecimal total = BigDecimal.ZERO;
        for (Product product : selected) {
            if (product.getStockQuantity() < quantities.get(product.getProductId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Some items no longer have enough stock. Review your bag.");
            }
            if (product.getPrice() == null || product.getPrice().signum() < 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "An item price is unavailable. Review your bag.");
            }
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(quantities.get(product.getProductId()))));
        }
        if (total.compareTo(request.expectedTotal()) != 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Prices have changed. Review your bag before placing your order.");
        }

        Order order = new Order.Builder().setOrderDate(LocalDateTime.now())
                .setStatus(OrderStatus.PROCESSING).setTotalAmount(total).setCustomer(customer).build();
        order.setCheckoutReference(reference);
        order.setCheckoutDetails(details);
        for (Product product : selected) {
            int quantity = quantities.get(product.getProductId());
            order.getOrderItems().add(new OrderItem.Builder().setOrder(order).setProduct(product)
                    .setQuantity(quantity).setUnitPrice(product.getPrice()).build());
            product.setStockQuantity(product.getStockQuantity() - quantity);
        }
        // Managed product updates and cascaded order items commit together, or all roll back.
        return OrderSummary.from(orders.saveAndFlush(order));
    }

    private CheckoutDetails normalize(CheckoutDetails input) {
        CheckoutDetails result = new CheckoutDetails();
        result.firstName = required(input.firstName);
        result.lastName = required(input.lastName);
        result.email = required(input.email).toLowerCase(Locale.ROOT);
        result.phoneNumber = required(input.phoneNumber);
        result.street = required(input.street);
        result.city = required(input.city);
        result.province = required(input.province);
        result.postalCode = required(input.postalCode);
        result.country = required(input.country);
        if (!result.email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
                || !result.phoneNumber.matches("[+0-9\\s()\\-]{7,25}")
                || !result.postalCode.matches("[0-9]{4}")
                || !"South Africa".equals(result.country)
                || !Set.of("Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
                    "Mpumalanga", "North West", "Northern Cape", "Western Cape").contains(result.province)) {
            throw badRequest("Check your contact details and delivery address.");
        }
        return result;
    }

    private String required(String value) {
        if (value == null || value.isBlank() || value.trim().length() > 200)
            throw badRequest("Complete all contact and delivery fields (up to 200 characters each).");
        return value.trim();
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
