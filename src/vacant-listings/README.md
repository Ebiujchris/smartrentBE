# Vacant Listings Module

A complete NestJS module for managing vacant property listings with public and authenticated endpoints.

## 📁 Module Structure

```
src/vacant-listings/
├── dto/
│   ├── create-vacant-listing.dto.ts    # DTO for creating listings
│   └── update-vacant-listing.dto.ts    # DTO for updating listings
├── vacant-listings.controller.ts        # HTTP endpoints
├── vacant-listings.service.ts           # Business logic
├── vacant-listings.module.ts            # Module definition
└── README.md                            # This file
```

## 🚀 API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Get All Active Listings
```http
GET /vacant-listings?bedrooms=2&minPrice=500&maxPrice=1500&location=Kampala
```

**Query Parameters:**
- `bedrooms` (optional): Filter by number of bedrooms
- `minPrice` (optional): Minimum rent amount
- `maxPrice` (optional): Maximum rent amount
- `location` (optional): Search in property address (case-insensitive)

**Response:** Array of active listings sorted by newest first

#### 2. Get Single Listing
```http
GET /vacant-listings/:id
```

**Response:** Full listing details with unit, property, and owner information

#### 3. Increment View Count
```http
PATCH /vacant-listings/:id/increment-view
```

**Purpose:** Track listing views for analytics

---

### Protected Endpoints (LANDLORD/PROPERTY_MANAGER/ADMIN Only)

#### 4. Create Listing
```http
POST /vacant-listings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "unitId": "unit-id-here",
  "title": "Beautiful 2BR Apartment in Kampala",
  "description": "Spacious apartment with modern amenities...",
  "highlights": ["Spacious", "Modern Kitchen", "Parking", "24/7 Security"],
  "contactName": "John Doe",
  "contactPhone": "+256700123456",
  "contactEmail": "john@example.com",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "availableFrom": "2024-02-01"
}
```

**Validation:**
- Verifies unit exists and belongs to authenticated landlord
- Ensures no duplicate listing exists for the unit
- All fields validated with class-validator decorators

#### 5. Get My Listings
```http
GET /vacant-listings/my-listings
Authorization: Bearer <token>
```

**Response:** All listings owned by the authenticated landlord

#### 6. Update Listing
```http
PATCH /vacant-listings/:id
Authorization: Bearer <token>
```

**Request Body:** Partial update (all fields optional)
```json
{
  "title": "Updated Title",
  "isActive": false,
  "highlights": ["Updated", "Highlights"]
}
```

**Security:**
- Verifies listing belongs to authenticated landlord
- If changing `unitId`, verifies new unit ownership

#### 7. Delete Listing
```http
DELETE /vacant-listings/:id
Authorization: Bearer <token>
```

**Security:** Verifies listing belongs to authenticated landlord

---

## 🔒 Authentication & Authorization

### Public Endpoints
- `GET /vacant-listings` - Browse listings
- `GET /vacant-listings/:id` - View single listing
- `PATCH /vacant-listings/:id/increment-view` - Track views

### Protected Endpoints (require JWT + LANDLORD role)
- `POST /vacant-listings` - Create listing
- `GET /vacant-listings/my-listings` - View own listings
- `PATCH /vacant-listings/:id` - Update listing (owner check)
- `DELETE /vacant-listings/:id` - Delete listing (owner check)

---

## 🎯 Key Features

### 1. **Ownership Validation**
- All create/update operations verify unit ownership
- Prevents unauthorized access to other landlords' listings
- Automatic filtering by owner in "my-listings" endpoint

### 2. **Smart Filtering**
Public listings endpoint supports:
- Bedroom count filtering
- Price range filtering (min/max)
- Location search (case-insensitive)
- Active status filtering (only shows active listings)

### 3. **Rich Data Relations**
All responses include:
- Full unit details (bedrooms, bathrooms, rent, etc.)
- Property information (name, address)
- Owner contact information (for public viewing)

### 4. **View Tracking**
- Increment view count for analytics
- Public endpoint to track interest
- Useful for landlords to see popular listings

### 5. **Data Validation**
Using `class-validator` decorators:
- Email validation
- Required fields enforcement
- Array validation (highlights, images)
- Date validation (availableFrom)

---

## 🗄️ Database Model

The module uses the existing `VacantListing` Prisma model:

```prisma
model VacantListing {
  id              String   @id @default(cuid())
  unitId          String   @unique
  unit            Unit     @relation(...)
  
  title           String
  description     String
  highlights      String[]
  
  contactName     String
  contactPhone    String
  contactEmail    String?
  
  images          String[]
  availableFrom   DateTime @default(now())
  isActive        Boolean  @default(true)
  viewCount       Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 🛡️ Error Handling

The service implements comprehensive error handling:

- **404 Not Found**: Unit or listing doesn't exist
- **403 Forbidden**: User doesn't own the unit/listing
- **400 Bad Request**: Duplicate listing for unit
- Proper HTTP status codes for all error scenarios

---

## 📝 Usage Examples

### Creating a Listing (Landlord)
```typescript
// POST /vacant-listings
// Headers: Authorization: Bearer <jwt-token>

const newListing = {
  unitId: "clx123456",
  title: "Luxury 3BR Apartment",
  description: "Modern apartment in prime location...",
  highlights: ["Pool", "Gym", "Security", "Parking"],
  contactName: "Jane Smith",
  contactPhone: "+256700123456",
  contactEmail: "jane@example.com",
  images: [
    "https://cdn.example.com/apt1.jpg",
    "https://cdn.example.com/apt2.jpg"
  ],
  availableFrom: "2024-03-01"
};
```

### Searching Listings (Public)
```typescript
// GET /vacant-listings?bedrooms=2&minPrice=800&maxPrice=1200&location=Nakasero

// Returns all active 2-bedroom listings
// in Nakasero area
// priced between 800-1200
```

### Updating a Listing (Landlord)
```typescript
// PATCH /vacant-listings/:id
// Headers: Authorization: Bearer <jwt-token>

const updates = {
  title: "Updated Title",
  isActive: false,  // Deactivate listing
  highlights: ["Updated", "Features"]
};
```

---

## ✅ Module Registration

The module is automatically registered in `app.module.ts`:

```typescript
@Module({
  imports: [
    // ... other modules
    VacantListingsModule,
  ],
})
export class AppModule {}
```

---

## 🧪 Testing Checklist

- [ ] Create listing as landlord
- [ ] Verify ownership validation
- [ ] Test duplicate listing prevention
- [ ] Filter by bedrooms
- [ ] Filter by price range
- [ ] Search by location
- [ ] View single listing (public)
- [ ] Get my listings (landlord)
- [ ] Update listing (owner check)
- [ ] Delete listing (owner check)
- [ ] Increment view count
- [ ] Test unauthorized access attempts

---

## 🔧 Future Enhancements

Potential improvements:
- Image upload/storage integration
- Advanced search (property type, amenities)
- Featured listings
- Listing expiration
- Email notifications for new listings
- Social sharing
- Listing statistics dashboard
