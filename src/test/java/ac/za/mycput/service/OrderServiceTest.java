/* OrderServiceTest.java

     OrderService test class

     Author: La-eeq Lewis (240696255)

     Date: 12 July 2026 */

package ac.za.mycput.service;

import ac.za.mycput.domain.Customer;
import ac.za.mycput.domain.Order;
import ac.za.mycput.domain.OrderStatus;
import ac.za.mycput.factory.CustomerFactory;
import ac.za.mycput.factory.OrderFactory;
import ac.za.mycput.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Customer testCustomer;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        testCustomer = CustomerFactory.createCustomer(
                1L,
                "John",
                "Doe",
                "john@gmail.com",
                "password123",
                "0712345678"
        );

        testOrder = OrderFactory.createOrder(
                1001L,
                LocalDateTime.now(),
                OrderStatus.PENDING,
                new BigDecimal("250.00"),
                testCustomer,
                null,
                null
        );
    }

    @Test
    void testSave() {
        when(orderRepository.save(testOrder)).thenReturn(testOrder);

        Order savedOrder = orderService.save(testOrder);

        assertNotNull(savedOrder);
        assertEquals(testOrder.getOrderId(), savedOrder.getOrderId());
        verify(orderRepository, times(1)).save(testOrder);
    }

    @Test
    void testSaveNullOrder() {
        Order savedOrder = orderService.save(null);

        assertNull(savedOrder);
        verify(orderRepository, never()).save(any());
    }

    @Test
    void testFindById() {
        when(orderRepository.findById(1001L)).thenReturn(Optional.of(testOrder));

        Order foundOrder = orderService.findById(1001L);

        assertNotNull(foundOrder);
        assertEquals(1001L, foundOrder.getOrderId());
        verify(orderRepository, times(1)).findById(1001L);
    }

    @Test
    void testFindByIdInvalid() {
        Order foundOrder = orderService.findById(-1L);

        assertNull(foundOrder);
        verify(orderRepository, never()).findById(any());
    }

    @Test
    void testFindByIdNotFound() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        Order foundOrder = orderService.findById(999L);

        assertNull(foundOrder);
        verify(orderRepository, times(1)).findById(999L);
    }

    @Test
    void testFindAll() {
        when(orderRepository.findAll()).thenReturn(List.of(testOrder));

        List<Order> orders = orderService.findAll();

        assertNotNull(orders);
        assertEquals(1, orders.size());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void testFindByCustomer() {
        when(orderRepository.findByCustomer(testCustomer)).thenReturn(List.of(testOrder));

        List<Order> orders = orderService.findByCustomer(testCustomer);

        assertNotNull(orders);
        assertEquals(1, orders.size());
        verify(orderRepository, times(1)).findByCustomer(testCustomer);
    }

    @Test
    void testFindByCustomerNull() {
        List<Order> orders = orderService.findByCustomer(null);

        assertNull(orders);
        verify(orderRepository, never()).findByCustomer(any());
    }

    @Test
    void testFindByStatus() {
        when(orderRepository.findByStatus(OrderStatus.PENDING)).thenReturn(List.of(testOrder));

        List<Order> orders = orderService.findByStatus(OrderStatus.PENDING);

        assertNotNull(orders);
        assertEquals(1, orders.size());
        verify(orderRepository, times(1)).findByStatus(OrderStatus.PENDING);
    }

    @Test
    void testFindByStatusNull() {
        List<Order> orders = orderService.findByStatus(null);

        assertNull(orders);
        verify(orderRepository, never()).findByStatus(any());
    }

    @Test
    void testDelete() {
        orderService.delete(1001L);

        verify(orderRepository, times(1)).deleteById(1001L);
    }

    @Test
    void testDeleteInvalidId() {
        orderService.delete(-1L);

        verify(orderRepository, never()).deleteById(any());
    }
}