package ac.za.mycput.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/** Contact and delivery snapshot for an order; never contains card details. */
@Embeddable
public class CheckoutDetails {
    @Column(name = "checkout_first_name")
    public String firstName;
    @Column(name = "checkout_last_name")
    public String lastName;
    @Column(name = "checkout_email")
    public String email;
    @Column(name = "checkout_phone")
    public String phoneNumber;
    @Column(name = "checkout_street")
    public String street;
    @Column(name = "checkout_city")
    public String city;
    @Column(name = "checkout_province")
    public String province;
    @Column(name = "checkout_postal_code")
    public String postalCode;
    @Column(name = "checkout_country")
    public String country;
}
