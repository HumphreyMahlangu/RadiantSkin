package ac.za.mycput.service;

import ac.za.mycput.domain.*;
import ac.za.mycput.repository.CartItemRepository;
import ac.za.mycput.repository.CartRepository;
import ac.za.mycput.repository.CustomerRepository;
import ac.za.mycput.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService implements IOrderService {

    private final OrderRepository repo;
    private final CustomerRepository customerRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Autowired
    public OrderService(OrderRepository repo, CustomerRepository customerRepository,
                        CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.repo = repo;
        this.customerRepository = customerRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public Order create(Order order) {
        return this.repo.save(order);
    }

    @Override
    public Order read(Long id) {
        return this.repo.findById(id).orElse(null);
    }

    @Override
    public Order update(Order order) {
        return this.repo.save(order);
    }

    @Override
    public boolean delete(Long id) {
        this.repo.deleteById(id);
        return true;
    }

    @Override
    public List<Order> getAll() {
        return this.repo.findAll();
    }

    @Override
    public List<Order> findByCustomer(Customer customer) {
        return this.repo.findByCustomer(customer);
    }

    @Override
    public List<Order> findByStatus(OrderStatus status) {
        return this.repo.findByStatus(status);
    }

    @Override
    public List<Order> findByCustomerId(Long customerId) {
        Customer customer = this.customerRepository.findById(customerId).orElse(null);

        if (customer == null) {
            return null;
        }

        return this.repo.findByCustomer(customer);
    }

    @Override
    public Order checkout(Long customerId) {

        Customer customer = this.customerRepository.findById(customerId).orElse(null);

        if (customer == null) {
            throw new IllegalArgumentException("Customer not found");
        }

        Cart cart = this.cartRepository.findByCustomer(customer);

        if (cart == null) {
            throw new IllegalArgumentException("Cart is empty");
        }

        List<CartItem> cartItems = this.cartItemRepository.findByCart(cart);

        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        // Work out the total price of everything in the cart
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            total = total.add(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Create the order itself
        Order order = new Order.Builder()
                .setCustomer(customer)
                .setOrderDate(LocalDateTime.now())
                .setStatus(OrderStatus.PENDING)
                .setTotalAmount(total)
                .build();

        order = this.repo.save(order);

        // Turn each cart item into an order item
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem.Builder()
                    .setOrder(order)
                    .setProduct(cartItem.getProduct())
                    .setQuantity(cartItem.getQuantity())
                    .setUnitPrice(cartItem.getProduct().getPrice())
                    .build();

            order.getOrderItems().add(orderItem);
        }

        this.repo.save(order);

        // Empty the cart now that it's become an order
        for (CartItem cartItem : cartItems) {
            this.cartItemRepository.deleteById(cartItem.getCartItemId());
        }

        return order;
    }

    @Override
    public Order updateStatus(Long orderId, OrderStatus status) {
        Order order = this.read(orderId);

        if (order == null) {
            throw new IllegalArgumentException("Order not found");
        }

        order.setStatus(status);
        return this.repo.save(order);
    }
}