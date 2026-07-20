package ac.za.mycput.controller;

/*
//Name: Siphokazi Malingatshoni
// Student number: 222868708
 */

import ac.za.mycput.domain.Address;
import ac.za.mycput.factory.AddressFactory;
import ac.za.mycput.service.AddressService;
import org.junit.jupiter.api.BeforeEach;

import org.mockito.Mockito;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AddressControllerTest {

    @Autowired
    private AddressController addressController;

    @MockBean
    private AddressService addressService;

    private Address address;

    @BeforeEach
    void setUp(){
        address = AddressFactory.createAddress("Street","City","8001");

    }
   @Test
    void create (){
        Mockito.when(addressService.create(address)).thenReturn (address);

        ResponseEntity<Address>response = addressController.create(address);
        AssertNotNull(response);
        assertEquals(200,response. getStatusCodeValue());
    }

}
