/* Cart.java

        Cart POJO class

        Author: Lebogang Andile Mahlangu (230561454)

        Date: 20 June 2026 */

package ac.za.mycput.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Cart {
    private Long cartId;
    private LocalDate createdDate;
    private List<CartItem> cartItems;

    private Cart() {

    }

    private Cart(Builder builder) {
        this.cartId = builder.cartId;
        this.createdDate = builder.createdDate;
        this.cartItems = builder.cartItems;

    }

    public Long getCartId() {
        return cartId;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public static class Builder {
        private Long cartId;
        private LocalDate createdDate;
        private List<CartItem> cartItems = new ArrayList<>();

        public Builder setCartId(Long cartId) {
            this.cartId = cartId;
            return this;
        }

        public Builder setCreatedDate(LocalDate createdDate) {
            this.createdDate = createdDate;
            return this;
        }

        public Builder setCartItems(List<CartItem> cartItems) {
            this.cartItems = cartItems;
            return this;
        }

        public Cart build() {
            return new Cart(this);
        }
    }

}
