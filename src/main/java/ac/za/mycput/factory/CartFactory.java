package ac.za.mycput.factory;

// Lebogang Andile Mahlangu 230561454

import ac.za.mycput.domain.Cart;
import ac.za.mycput.util.Helper;

public class CartFactory {

    public static Cart createCart(Long cartId, LocalDate createdDate, Customer customer, List<CartItem> cartItems) {

        if (!Helper.isValidCartId(cartId) || createdDate == null) {
            return null;
        }

        if (!Helper.isValidCustomer(customer)){
            return null;
        }

        return new Cart.Builder()
                .setCartId(cartId)
                .setCreatedDate(createdDate)
                .setCustomer(customer)
                .setCartItems(cartItems)
                .build();
    }
}