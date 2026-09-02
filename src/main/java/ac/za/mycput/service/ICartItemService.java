package ac.za.mycput.service;

import ac.za.mycput.domain.Cart;
import ac.za.mycput.domain.CartItem;
import ac.za.mycput.domain.Product;

import java.util.List;

public interface ICartItemService {

    CartItem create(CartItem cartItem);

    CartItem read(Long cartItemId);

    CartItem update(CartItem cartItem);

    boolean delete(Long cartItemId);

    List<CartItem> getAll();

    List<CartItem> findByCart(Cart cart);

    List<CartItem> findByProduct(Product product);

    Cart addToCart(Long customerId, Long productId, int quantity);
}