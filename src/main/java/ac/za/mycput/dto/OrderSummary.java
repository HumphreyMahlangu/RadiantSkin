package ac.za.mycput.dto;

import ac.za.mycput.domain.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Public receipt without customer credentials, delivery details or entity cycles. */
public record OrderSummary(Long orderId, LocalDateTime orderDate, String status,
                           BigDecimal totalAmount, List<Item> orderItems) {
    public record ProductName(String name) { }
    public record Item(Long orderItemId, int quantity, BigDecimal unitPrice, ProductName product) { }

    public static OrderSummary from(Order order) {
        return new OrderSummary(order.getOrderId(), order.getOrderDate(),
                order.getStatus().name(), order.getTotalAmount(),
                order.getOrderItems() == null ? List.of() : order.getOrderItems().stream()
                        .map(item -> new Item(item.getOrderItemId(), item.getQuantity(), item.getUnitPrice(),
                                item.getProduct() == null ? null : new ProductName(item.getProduct().getName())))
                        .toList());
    }
}
