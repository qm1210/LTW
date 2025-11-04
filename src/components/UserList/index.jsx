import React from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Divider
} from "@mui/material";
import { Link } from "react-router-dom";
import models from "../../modelData/models";

import "./styles.css";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
    // Get all users from models
    const users = models.userListModel();

    return (
        <div>
            <Typography variant="h6" sx={{ p: 2 }}>
                Users
            </Typography>
            <Divider />
            <List component="nav">
                {users.map((user) => (
                    <ListItem key={user._id} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={`/users/${user._id}`}
                        >
                            <ListItemText
                                primary={`${user.first_name} ${user.last_name}`}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default UserList;