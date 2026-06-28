package ac.za.mycput.util;

public class Helper {

    public static boolean isNullEmpty(String value) {
        return value == null || value.isEmpty();
    }

    public static boolean isValidPaymentId(Long paymentId) {
        if (paymentId == null || paymentId <= 0) {
            return false;
        }
        return true;
    }

    public static boolean isValidAmount(double amount) {
        return amount > 0;
    }

    public static boolean isValidTransactionReference(String transactionReference) {
        return !isNullEmpty(transactionReference);
    }

    public static boolean isValidUserId(Long userId) {
        if (userId == null || userId <= 0) {
            return false;
        }
        return true;
    }

    public static boolean isValidEmail(String email) {
        return email != null &&
                email.contains("@") &&
                email.contains(".");
    }

    public static boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber != null && phoneNumber.matches("^0\\d{9}$");

    }

    public static boolean isValidCartId(Long cartId) {
        return cartId != null && cartId > 0;
    }

    public static boolean isValidCartItemId(Long cartItemId) {
        return cartItemId != null && cartItemId > 0;
    }

    public static boolean isValidQuantity(int quantity) {
        return quantity > 0;
    }

    public static boolean isValidProduct(Product product) {
        return !=null;
    }

    public static boolean isValidCustomer(Customer customer) {
        return customer != null;
    }

}