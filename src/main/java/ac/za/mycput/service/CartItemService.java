/* CartItemServiceImpl.java

        CartItemService implementation

        Author: Lebogang Andile Mahlangu (230561454) */

package ac.za.mycput.service;

import ac.za.mycput.domain.Cart;
import ac.za.mycput.domain.CartItem;
import ac.za.mycput.domain.Customer;
import ac.za.mycput.domain.Product;
import ac.za.mycput.repository.CartItemRepository;
import ac.za.mycput.repository.CartRepository;
import ac.za.mycput.repository.CustomerRepository;
import ac.za.mycput.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CartItemService implements ICartItemService {

    private final CartItemRepository repo;
    private final CartRepository cartRepo;
    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;

    @Autowired
    public CartItemService(CartItemRepository repo, CartRepository cartRepo,
                           CustomerRepository customerRepo, ProductRepository productRepo) {
        this.repo = repo;
        this.cartRepo = cartRepo;
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
    }

    @Override
    public CartItem create(CartItem cartItem) {
        return this.repo.save(cartItem);
    }

    @Override
    public CartItem read(Long cartItemId) {
        return this.repo.findById(cartItemId).orElse(null);
    }

    @Override
    public CartItem update(CartItem cartItem) {
        return this.repo.save(cartItem);
    }

    @Override
    public boolean delete(Long cartItemId) {
        this.repo.deleteById(cartItemId);
        return true;
    }

    @Override
    public List<CartItem> getAll() {
        return this.repo.findAll();
    }

    @Override
    public List<CartItem> findByCart(Cart cart) {
        return this.repo.findByCart(cart);
    }

    @Override
    public List<CartItem> findByProduct(Product product) {
        return this.repo.findByProduct(product);
    }

    @Override
    public Cart addToCart(Long customerId, Long productId, int quantity) {

        Customer customer = this.customerRepo.findById(customerId).orElse(null);
        Product product = this.productRepo.findById(productId).orElse(null);

        if (customer == null || product == null) {
            throw new IllegalArgumentException("Customer or product not found");
        }

        Cart cart = this.cartRepo.findByCustomer(customer);

        if (cart == null) {
            cart = new Cart.Builder()
                    .setCustomer(customer)
                    .setCreatedDate(LocalDate.now())
                    .build();
            cart = this.cartRepo.save(cart);
        }

        List<CartItem> existingItems = this.repo.findByCart(cart);
        CartItem existingItem = null;

        for (CartItem item : existingItems) {
            if (item.getProduct().getProductId().equals(productId)) {
                existingItem = item;
                break;
            }
        }

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return this.repo.save(existingItem).getCart();
        } else {
            CartItem newItem = new CartItem.Builder()
                    .setCart(cart)
                    .setProduct(product)
                    .setQuantity(quantity)
                    .build();
            this.repo.save(newItem);
            return cart;
        }
    }
}