import DBConnection from "../utils/connectToDB";

interface IUser {
  id: number;
  username: string;
  email: string;
}

async function createUserTable() {
  const query = `
      CREATE TABLE users (
          id NUMBER GENERATED BY DEFAULT AS IDENTITY,
          username VARCHAR2(50) NOT NULL,
          email VARCHAR2(100) NOT NULL,
          PRIMARY KEY (id)
      )
  `;

  let conn;

  try {
    conn = await DBConnection.getConnection();
    const result: any = await conn?.execute(
      `SELECT table_name FROM user_tables WHERE table_name = 'users'`
    );

    if (result.rows.length === 0) {
      // Bảng chưa tồn tại, tạo bảng mới
      await conn?.execute(query);
    }
  } catch (err) {
    console.error("Error creating user table:", err);
  } finally {
    if (conn) {
      try {
        await conn.close(); // Release the connection back to the pool
      } catch (err) {
        console.error("Error closing connection", err);
      }
    }
  }
}

const createUser = async (user: IUser) => {
  const query = `INSERT INTO users (username, email) VALUES (:username, :email)`;

  const { username, email } = user;
  let conn;

  try {
    conn = await DBConnection.getConnection();
    await conn?.execute(query, [username, email], {
      autoCommit: true,
    });
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    if (conn) {
      try {
        await conn.close(); // Release the connection back to the pool
      } catch (err) {
        console.error("Error closing connection", err);
      }
    }
  }
};

const getUsers = async () => {
  const query = `SELECT id, username, email FROM users`;
  let conn;

  try {
    conn = await DBConnection.getConnection();
    const result = await conn?.execute(query);

    if (result?.rows === undefined) return [];

    return result.rows.map((row: any) => {
      return {
        id: row[0] as number,
        username: row[1] as string,
        email: row[2] as string,
      };
    });
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    if (conn) {
      try {
        await conn.close(); // Release the connection back to the pool
      } catch (err) {
        console.error("Error closing connection", err);
      }
    }
  }
};

const getSingleUser = async (id: number): Promise<IUser | undefined> => {
  const query = `SELECT id, username, email FROM users WHERE id = :id`;
  let conn;

  try {
    conn = await DBConnection.getConnection();
    const result = await conn?.execute(query, [id]);

    if (result?.rows === undefined || result?.rows.length === 0)
      return undefined;

    const firstUser: any = result.rows[0];

    const user: IUser = {
      id: firstUser[0] as number,
      username: firstUser[1] as string,
      email: firstUser[2] as string,
    };

    return user;
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    if (conn) {
      try {
        await conn.close(); // Release the connection back to the pool
      } catch (err) {
        console.error("Error closing connection", err);
      }
    }
  }
};

const updateUser = async (id: number, user: IUser) => {
  const query = `UPDATE users SET username = :username, email = :email WHERE id = :id`;
  const { username, email } = user;
  let conn;

  try {
    conn = await DBConnection.getConnection();
    await conn?.execute(query, [username, email, id], {
      autoCommit: true,
    });
  } catch (err) {
    console.error("Error updating user:", err);
  } finally {
    if (conn) {
      try {
        await conn.close(); // Release the connection back to the pool
      } catch (err) {
        console.error("Error closing connection", err);
      }
    }
  }
};

const deleteUser = async (id: number) => {
  const query = `DELETE FROM users WHERE id = :id`;
  let conn;

  try {
    conn = await DBConnection.getConnection();
    await conn?.execute(query, [id], { autoCommit: true });
  } catch (err) {
    console.error("Error deleting user:", err);
  } finally {
    if (conn) {
      try {
        await conn.close(); // Release the connection back to the pool
      } catch (err) {
        console.error("Error closing connection", err);
      }
    }
  }
};

export {
  createUserTable,
  createUser,
  updateUser,
  getUsers,
  deleteUser,
  getSingleUser,
};
