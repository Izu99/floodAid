# Location Feature Implementation

## Overview
Added a new location system where collectors can add flood-affected areas with up to 5 images, and donors can search and view these locations.

## Backend Changes

### New Files
1. **server/src/models/Location.ts** - Location model with fields:
   - name, district, address, description
   - images (array of up to 5 images)
   - collector (reference to User)
   - status, timestamps

2. **server/src/routes/locations.ts** - API endpoints:
   - `GET /api/locations` - Get all locations (with optional district filter)
   - `POST /api/locations` - Create location (collectors only, supports 5 images)
   - `GET /api/locations/districts` - Get list of districts

### Modified Files
1. **server/src/config/upload.ts** - Updated to support two upload types:
   - `faceUpload` - For collector face images (uploads/faces/)
   - `upload` - For location images (uploads/locations/)

2. **server/src/routes/auth.ts** - Updated to use `faceUpload` for registration

3. **server/src/index.ts** - Added location routes

## Frontend Changes

### New Files
1. **client/src/types/location.ts** - TypeScript types for Location

2. **client/src/lib/location-api.ts** - API client for location operations

3. **client/src/components/donations/location-form.tsx** - Form for collectors to add locations:
   - Supports up to 5 image uploads
   - Image preview with remove functionality
   - District, address, name, description fields

4. **client/src/components/donations/location-card.tsx** - Card to display location:
   - Shows all images in a grid
   - Displays collector info with profile image
   - Shows location details

5. **client/src/app/locations/page.tsx** - Main locations page:
   - District filter dropdown
   - Grid view of locations
   - Add location button (collectors only)

## Features

### For Collectors:
- Add affected locations with 5 images
- Images are uploaded and previewed before submission
- Only collectors can add locations

### For Donors:
- View all locations
- Filter by district
- See collector profile image and contact info
- View all location images

## Usage

1. **Start the server**: `npm run dev` in server folder
2. **Start the client**: `npm run dev` in client folder
3. **Navigate to**: http://localhost:3000/locations
4. **Collectors**: Click "Add Location" to add new affected areas
5. **Donors**: Use district dropdown to filter locations

## API Endpoints

- `GET /api/locations?district=Colombo` - Get locations (optional district filter)
- `POST /api/locations` - Create location (multipart/form-data with images)
- `GET /api/locations/districts` - Get available districts

## Image Storage

- Face images: `server/uploads/faces/`
- Location images: `server/uploads/locations/`
- Served via: `http://localhost:5000/uploads/`
