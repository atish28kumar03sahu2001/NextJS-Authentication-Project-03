const Users = [
    {
        username: "username1",
        email: "username1@mail.com",
        password: "user1@123", 
    },
    {
        username: "username2",
        email: "username2@mail.com",
        password: "user2@123", 
    },
    {
        username: "username3",
        email: "username3@mail.com",
        password: "user3@123",
    },
]
export const getUserByEmail = (email) => {
    return Users.find(user => user.email === email);
};
