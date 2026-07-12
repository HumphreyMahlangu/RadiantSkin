/* OrderService.java

     OrderService class

     Author: La-eeq Lewis (240696255)

     Date: 12 July 2026 */

package ac.za.mycput.service;

import ac.za.mycput.domain.Customer;
import ac.za.mycput.domain.Order;
import ac.za.mycput.domain.OrderStatus;
import ac.za.mycput.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order save(Order order) {
        if (order == null) {
            return null;
        }
        return orderRepository.save(order);
    }

    public Order findById(Long orderId) {
        if (orderId == null || orderId <= 0) {
            return null;
        }
        return orderRepository.findById(orderId).orElse(null);
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public List<Order> findByCustomer(Customer customer) {
        if (customer == null) {
            return null;
        }
        return orderRepository.findByCustomer(customer);
    }

    public List<Order> findByStatus(OrderStatus status) {
        if (status == null) {
            return null;
        }
        return orderRepository.findByStatus(status);
    }

    public void delete(Long orderId) {
        if (orderId != null && orderId > 0) {
            orderRepository.deleteById(orderId);
        }
    }
}