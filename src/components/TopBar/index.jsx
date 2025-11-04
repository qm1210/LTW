import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import models from "../../modelData/models";

import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
    const { userId } = useParams();
    const location = useLocation();
    
    // Get context information based on current route
    const getContextInfo = () => {
        if (!userId) {
            return "Photo Sharing App";
        }
        
        const user = models.userModel(userId);
        if (!user) {
            return "Photo Sharing App";
        }
        
        const userName = `${user.first_name} ${user.last_name}`;
        
        if (location.pathname.includes('/photos/')) {
            return `Photos of ${userName}`;
        } else if (location.pathname.includes('/users/')) {
            return userName;
        }
        
        return "Photo Sharing App";
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Phạm Nguyễn Quang Minh B22DCAT193
                </Typography>
                <Typography variant="h6" component="div">
                    {getContextInfo()}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;