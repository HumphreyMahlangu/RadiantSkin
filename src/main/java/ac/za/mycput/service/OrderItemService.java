/* OrderItemService.java

     OrderItemService class

     Author: La-eeq Lewis (240696255)

     Date: 12 July 2026 */

package ac.za.mycput.service;

import ac.za.mycput.domain.Order;
import ac.za.mycput.domain.OrderItem;
import ac.za.mycput.domain.Product;
import ac.za.mycput.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public OrderItem save(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }
        return orderItemRepository.save(orderItem);
    }

    public OrderItem findById(Long orderItemId) {
        if (orderItemId == null || orderItemId <= 0) {
            return null;
        }
        return orderItemRepository.findById(orderItemId).orElse(null);
    }

    public List<OrderItem> findAll() {
        return orderItemRepository.findAll();
    }

    public List<OrderItem> findByOrder(Order order) {
        if (order == null) {
            return null;
        }
        return orderItemRepository.findByOrder(order);
    }

    public List<OrderItem> findByProduct(Product product) {
        if (product == null) {
            return null;
        }
        return orderItemRepository.findByProduct(product);
    }

    public void delete(Long orderItemId) {
        if (orderItemId != null && orderItemId > 0) {
            orderItemRepository.deleteById(orderItemId);
        }
    }
}