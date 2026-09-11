import { useState, useEffect } from "react";

interface Customer {
    userId : number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

interface Address {
    addressId: number;
    street: string
    city:string
    province:string
    postalCode:string
    country:string
    customer:{ useId: number }
}

function AddressManager(){
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [addresses, setAddress]= useState<Address[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [postalCode, setPostalCode]= useState("");
    const [country, setCountry] = useState("");

    useEffect (() =>{
        const stored = localStorage.getItem("customer")

       if(!stored ) {
           return ;
       }

       const parsed: Customer = JSON.parse(stored);
       setCustomer(parsed);

       fetch("\"http://localhost:8080/address/getAll\"")
           .then((response) => response.json())
           .then((data: Address[]) =>
               setAddresses(data.filter((a) =>a.customer?.userId === parsed.userId ))
    );
    }, []);

    const resetForm = () => {
        setStreet("");
        setCity("");
        setProvince("");
        setPostalCode("");
        setCountry("");
        setEditingId(null);
    };

    const handleAddClick = () => {
        resetForm();
        setShowForm(true);
    };

    const handleAddClick = (address: Address) => {
        setStreet (address.street);
        setCity(address.city);
        setProvince(address.province);
        setPostalCode(address.postalCode);
        setCountry(address.country);
        setEditingId(address.addressId);
        setShowForm(true);
    };

    const handleSave = () => {
        if(!customer) {
            return ;
        }
         const payload = {
            street,
            city,
            province,
            postalCode,
            country,
            customer : { userId: customer.userId },
         };

        if (editingId ==== null ) {
            fetch ("http://localhost:8080/address/create"), {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((response) =>response.json())
                .then((created: Address) => {
                    setAddresses((prev) => [...prev, created]);
                    setShowForm(false);
                    resetForm();
                });

            } else{
            fetch("http://localhost:8080/address/update", {
                method: "PUT",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify({ addressId: editingId, ...payload }),
            })

                .then((response ) => response.json())
                .then((updated: Address) => {
                    setAddresses((prev) =>
                    prev.map((a) => (a.addressId === updated.addressId ? updated : a))
                    );
                    setShowForm(false);
                    resetForm();
                });
        }
    };

    const handleDelete = (addressId : number) => {
        fetch(`http://localhost:8080/address/delete/${addressId}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((success: boolean) => {
                if (success) {
                    setAddresses((prev) => prev.filter((a) => a.addressId !== addressId));
                }
            });
    };
       if (!customer) {
        return null;
    }

    return (
        <div className="panel">
            <div className="panel-head">
                <h3>My Addresses</h3>
            </div>

            {addresses.length === 0 && !showForm && <p>No addresses saved yet.</p>}

            {addresses.map((address) => (
                <div className="cart-item" key={address.addressId}>
                    <div className="cart-item-info">
                        <h4>
                            {address.street}, {address.city}
                        </h4>
                        <div>
                            {address.province}, {address.postalCode}, {address.country}
                        </div>
                    </div>
                    <button className="btn btn-outline" onClick={() => handleEditClick(address)}>
                        Edit
                    </button>
                    <button className="icon-btn" onClick={() => handleDelete(address.addressId)}>
                        🗑
                    </button>
                </div>
            ))}

            {showForm ? (
                <div className="profile-grid" style={{ marginTop: 18 }}>
                    <div className="form-group">
                        <label>Street</label>
                        <input value={street} onChange={(e) => setStreet(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Province</label>
                        <input value={province} onChange={(e) => setProvince(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Postal Code</label>
                        <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label>Country</label>
                        <input value={country} onChange={(e) => setCountry(e.target.value)} />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <button className="btn btn-primary" onClick={handleSave}>
                            {editingId === null ? "Add Address" : "Save Changes"}
                        </button>{" "}
                        <button className="btn btn-outline" onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={handleAddClick}>
                    + Add Address
                </button>
            )}
        </div>
    );
}




