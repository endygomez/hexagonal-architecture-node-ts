import { User } from "../../../../../../src/contexts/users/domain/entities/user.entity";
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

// Prueba unitaria básica para User entity usando BDD

describe('User Entity', () => {
  it('debería crear un usuario correctamente con los valores dados', () => {
    // Arrange
    const id = 'b3b6a1e2-4c2d-4e7a-9c1a-2f3e4d5b6a7c'; // UUID v4 válido
    const name = 'Juan Pérez';
    const email = 'juan.perez@example.com';
    const password = 'passwordSeguro123!';
    const createdAt = new Date('2024-01-01T10:00:00Z');
    const updatedAt = new Date('2024-01-01T10:00:00Z');
    const deletedAt = new Date('2024-01-01T10:00:00Z');

    // Act
    const user = User.create(id, name, email, password, createdAt, updatedAt, deletedAt);

    // Assert
    assert(user.id.value, id);
    assert(user.name.value, name);
    assert(user.email.value, email);
    assert(user.password.value, password);
    assert.deepEqual(user.createdAt.value, createdAt);
    assert.deepEqual(user.updatedAt.value, updatedAt);
    assert.equal(user.deletedAt.value, deletedAt);
  });
});

