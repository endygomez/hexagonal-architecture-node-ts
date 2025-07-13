# Hexagonal Architecture

Hexagonal Architecture, also known as Ports and Adapters, enables a clear separation of concerns within your codebase. The core principle is that the inner layers (Domain) are not affected by the outer layers (Infrastructure, Application). This approach enhances maintainability, scalability, and testability.

## Layered Structure

- **Domain**: Contains the business logic, entities, domain errors, value objects, and repository interfaces. The domain layer is self-contained and does not depend on any other layer.
- **Application**: Implements use cases, mappers, and read models. Application logic can access both its own resources and those of the domain layer.
- **Infrastructure**: Handles technology-specific concerns such as web frameworks (e.g., Fastify), data transfer objects (DTOs), mappers, repositories, and schemas. Infrastructure can access resources from all layers.

### Dependency Rule
- The Domain layer can only access its own resources.
- The Application layer can access its own resources and those of the Domain layer.
- The Infrastructure layer can access its own resources, as well as those of the Application and Domain layers.

## Modular System

### Example: Users Module

- **Features**:
  - Create users
  - List users
  - Find users
  - Edit users
  - Delete users

### Directory Structure

- **Domain**
  - Entities
  - Domain Errors
  - Value Objects
  - Repository Interfaces
- **Application**
  - Mappers
  - Read Models
  - Use Cases (one folder per use case, each containing a single file)
- **Infrastructure**
  - Entry Technology (e.g., Fastify, Express)
  - DTOs
  - Mappers
  - Repositories
  - Schemas

## Best Practices

- Any operation that mutates or changes state (e.g., create, update) should return `void`.
- Query operations should return the requested data.
- Use case files should be organized in their own folders for clarity and scalability.
- Use cases should not depend on each other; instead, rely on repository interfaces for cross-use-case data access.
- Use two types of validation:
  - **Domain validation**: Ensures application data integrity.
  - **Infrastructure validation**: Ensures incoming data from external sources is as expected.
- Implement a private `mapToDomain` method for mapping infrastructure data to domain objects. If needed, also implement `mapToInfrastructure` for the reverse mapping.

## Application Flow

```text
HTTP request → Validate Schema | DTO → toCommand → Use Case Execution → HTTP response
```

1. **HTTP request**: The entry point, typically via a web framework.
2. **Validate Schema / DTO**: Infrastructure validates incoming data and maps it to a Data Transfer Object.
3. **toCommand**: The DTO is converted into a command object suitable for the use case.
4. **Use Case Execution**: The application layer executes the use case, applying business logic and interacting with the domain.
5. **HTTP response**: The result is returned to the client.

---

This structure ensures a robust, maintainable, and scalable codebase, following the principles of Hexagonal Architecture.