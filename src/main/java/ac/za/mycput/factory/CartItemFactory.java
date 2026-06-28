package ac.za.mycput.factory;

// Lebogang Andile Mahlangu 230561454

import ac.za.mycput.domain.Cart;
import ac.za.mycput.util.Helper;
import ac.za.mycput.domain.CartItem;

public class CartItemFactory {

    public static CartItem createdCartItem(Long cartItemId, int quantity, Product product) {

        if (!Helper.isValidCartItemId(cartItemId)) {
            return null;
        }

        if (!Helper.isValidQuantity(quantity)) {
            return null;
        }

        if (!Helper.isValidProduct(product)) {
            return null;
        }

        return new CartItem.Builder()
                .setCartItemId(cartItemId)
                .setQuantity(quantity)
                .setProduct(product)
                .build();
    }
}
