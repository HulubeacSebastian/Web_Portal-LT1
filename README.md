# Document Management Portal - Assignment 1

A front-end React application built for Assignment 1. This project implements a document management system featuring a master-detail interface, full CRUD operations, and form validations, utilizing entirely in-memory data storage as per the assignment requirements (Bronze level).

## 🚀 Features

* **Presentation Page:** Landing page featuring the project logo, name, tagline, and a brief description.
* **Master View (Document List):** A data table displaying all documents with **pagination** support.
* **Detail View:** A dedicated page to view the complete details of a specific document.
* **Full CRUD Functionality:** * Create new documents.
  * Read (view list and details).
  * Update existing documents.
  * Delete documents.
* **Form Validation:** Client-side validation for all data entry forms (Create/Edit).
* **In-Memory Storage:** Data is managed entirely in RAM using React state/context (no external database), pre-loaded with seed data for testing.
* **Separation of Concerns:** Clean architecture separating UI components from business logic and state management.

## 🛠️ Tech Stack

* **Frontend:** React.js
* **State Management:** React Context API / Local State
* **Routing:** React Router (handling `/`, `/documente`, `/documente/:id`, etc.)
* **Testing:** Jest & React Testing Library (Unit & Component tests)

## 📦 Entity Structure

The core data model for this application is the `Document` entity, which includes the following properties:
* `id` (Unique identifier)
* `titlu` (Title)
* `tip` (Type)
* `emitent` (Issuer)
* `data` (Date)
* `status` (Status)
* `descriere` (Description)

## 🚦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

* Node.js (v16 or higher recommended)
* npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/portal-lt1-frontend.git](https://github.com/your-username/portal-lt1-frontend.git)
