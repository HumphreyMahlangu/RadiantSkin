/* CartItem.java

        Cart Item POJO class

        Author: Lebogang Andile Mahlangu (230561454)

        Date: 20 June 2026 */

package ac.za.mycput.domain;

public class CartItem {

    private Long cartItem;
    private int quantity;
    private Product product;

    private CartItem(Builder builder) {
        this.cartItem = builder.cartItem;
        this.quantity = builder.quantity;
        this.product = builder.product;
    }

    public Long getCartItem() {
        return cartItem;
    }


    public int getQuantity() {
        return quantity;
    }

    public Product getProduct() {
        return product;
    }

    public static class Builder {
        private Long cartItem;
        private int quantity;
        private Product product;

        public Builder setCartItem(Long cartItem) {
            this.cartItem = cartItem;
            return this;
        }

        public Builder setQuantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder setProduct(Product product) {
            this.product = product;
            return this;
        }

        /**
         * Builds and returns a CartItem object.
         *
         */
        public CartItem build() {
            return new CartItem(this);
        }
    }

}
