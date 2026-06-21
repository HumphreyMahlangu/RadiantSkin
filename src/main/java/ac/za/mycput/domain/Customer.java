package ac.za.mycput.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Customer extends User {

    private String phoneNumber;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Address> addresses = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    protected Customer() {
    }

    private Customer(Builder builder) {
        super(builder);
        this.phoneNumber = builder.phoneNumber;
        this.addresses = builder.addresses;
        this.cart = builder.cart;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public Cart getCart() {
        return cart;
    }

    @Override
    public String toString() {
        return "Customer{" + super.toString() +
                ", phoneNumber='" + phoneNumber + '\'' +
                '}';
    }

    public static class Builder extends User.Builder<Builder> {
        private String phoneNumber;
        private List<Address> addresses = new ArrayList<>();
        private Cart cart;

        public Builder setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public Builder setAddresses(List<Address> addresses) {
            this.addresses = addresses;
            return this;
        }

        public Builder setCart(Cart cart) {
            this.cart = cart;
            return this;
        }

        @Override
        public Builder copy(User user) {
            super.copy(user);
            if (user instanceof Customer) {
                Customer customer = (Customer) user;
                this.phoneNumber = customer.phoneNumber;
                this.addresses = customer.addresses;
                this.cart = customer.cart;
            }
            return this;
        }

        @Override
        protected Builder self() {
            return this;
        }

        public Customer build() {
            return new Customer(this);
        }
    }
}