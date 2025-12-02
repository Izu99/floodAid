Here is a list of API endpoints for adding data (POST requests) across the application, which you can use with Postman:

---

### **1. User Authentication & Profile**

**Endpoint:** `POST /auth/register`
*   **Description:** Register a new user (donor or collector). Collectors require a face image.
*   **Content-Type:** `multipart/form-data`
*   **Body Fields:**
    *   `name`: (string, required) User's full name.
    *   `phone`: (string, required) User's phone number (must be unique).
    *   `password`: (string, required) User's password (min 6 characters).
    *   `role`: (string, required) User role, either `"donor"` or `"collector"`.
    *   `faceImage`: (file, required for `collector` role) User's profile picture.

**Endpoint:** `POST /auth/login`
*   **Description:** Log in an existing user.
*   **Content-Type:** `application/json`
*   **Body Fields:**
    *   `phone`: (string, required) User's phone number.
    *   `password`: (string, required) User's password.

**Endpoint:** `POST /auth/upload-location-image`
*   **Description:** Upload an image to be associated with a location (requires authentication).
*   **Content-Type:** `multipart/form-data`
*   **Headers:** `Authorization: Bearer <token>`
*   **Body Fields:**
    *   `image`: (file, required) The image file to upload.

**Endpoint:** `POST /auth/update-face-image`
*   **Description:** Update a user's profile face image (requires authentication).
*   **Content-Type:** `multipart/form-data`
*   **Headers:** `Authorization: Bearer <token>`
*   **Body Fields:**
    *   `faceImage`: (file, required) The new face image file.

---

### **2. Donations**

**Endpoint:** `POST /donations/`
*   **Description:** Create a new donation offer.
*   **Content-Type:** `application/json`
*   **Body Fields:**
    *   `name`: (string, required) Donor's name.
    *   `phone`: (string, required) Donor's phone number.
    *   `district`: (string, required) District where the donation is located.
    *   `address`: (string, required) Full address for donation collection.
    *   `items`: (string, required) Description of items being donated (e.g., "Rice, milk powder").
    *   `description`: (string, optional) Additional details about the donation.
    *   `urgency`: (string, optional) Urgency level (e.g., "low", "medium", "high").
    *   `availableUntil`: (string, optional, date format) Date until the donation is available.

---

### **3. Education Support**

**Endpoint:** `POST /education/`
*   **Description:** Create a new education support offer.
*   **Content-Type:** `application/json`
*   **Body Fields:**
    *   `name`: (string, required) Name of student/parent.
    *   `contactPerson`: (string, required) Name of the contact person.
    *   `phone`: (string, required) Contact phone number.
    *   `district`: (string, required) District.
    *   `address`: (string, required) Full address.
    *   `school`: (string, optional) Name of the school.
    *   `grade`: (string, optional) Student's grade (e.g., "Grade 5").
    *   `needs`: (string, required) Description of educational needs (e.g., "Books, uniforms").
    *   `additionalDetails`: (string, optional) Any other relevant information.

---

### **4. Help Requests**

**Endpoint:** `POST /help-requests/`
*   **Description:** Create a new help request.
*   **Content-Type:** `application/json`
*   **Body Fields:**
    *   `name`: (string, required) Requestor's name.
    *   `phone`: (string, required) Requestor's phone number.
    *   `additionalPhone`: (string, optional) Additional contact number.
    *   `district`: (string, required) District where help is needed.
    *   `address`: (string, required) Full address where help is needed.
    *   `helpDescription`: (string, required) Description of help needed (e.g., "Food, drinking water").
    *   `additionalDetails`: (string, optional) Any other relevant information.
    *   `category`: (string, required) Category of help (e.g., "food", "education", "shelter", "transport", "other").

---

### **5. Locations (Collection Points)**

**Endpoint:** `POST /locations/`
*   **Description:** Create a new collection point.
*   **Content-Type:** `multipart/form-data`
*   **Body Fields:**
    *   `name`: (string, required) Name of the collection point (e.g., "Colombo Relief Center").
    *   `district`: (string, required) District.
    *   `address`: (string, required) Full address of the collection point.
    *   `description`: (string, required) Description of items collected or details about the location.
    *   `startDate`: (string, required, date format) Start date of operation.
    *   `endDate`: (string, required, date format) End date of operation.
    *   `startTime`: (string, required, time format) Start time of operation.
    *   `endTime`: (string, required, time format) End time of operation.
    *   `contactName`: (string, required) Name of the contact person.
    *   `contactPhone`: (string, required) Contact phone number.
    *   `additionalPhone`: (string, optional) Additional contact phone number.
    *   `images`: (array of files, min 1, max 5) Files for location images. The *first* file in the array is typically used as the `contactImage`, and subsequent files are `location.images`.

---

### **6. Transport Offers**

**Endpoint:** `POST /transport/`
*   **Description:** Create a new transport offer for relief efforts.
*   **Content-Type:** `application/json`
*   **Body Fields:**
    *   `name`: (string, required) Contact name.
    *   `phone`: (string, required) Contact phone number.
    *   `district`: (string, required) District of operation.
    *   `location`: (string, required) Current location or area of operation.
    *   `vehicleType`: (string, required) Type of vehicle (e.g., "Lorry", "Van").
    *   `capacity`: (string, required) Capacity of the vehicle (e.g., "1000kg", "5 people").
    *   `availability`: (string, required) Availability details (e.g., "24/7", "Weekends").
    *   `additionalDetails`: (string, optional) Any other relevant information.

---

### **7. Volunteer Registrations**

**Endpoint:** `POST /volunteering/`
*   **Description:** Register as a volunteer.
*   **Content-Type:** `application/json`
*   **Body Fields:**
    *   `name`: (string, required) Volunteer's name.
    *   `phone`: (string, required) Volunteer's phone number.
    *   `district`: (string, required) Volunteer's district.
    *   `skills`: (string, required) Description of skills/capabilities (e.g., "First aid, driving").
    *   `availability`: (string, required) Availability details (e.g., "Weekends", "Full time").
    *   `additionalDetails`: (string, optional) Any other relevant information.

---

**Note on `/face-image/update-face-image`:** This endpoint is a duplicate of `/auth/update-face-image`. It's generally better to use the `/auth` route for consistency.
