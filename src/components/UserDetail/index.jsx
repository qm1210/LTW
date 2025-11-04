import React from "react";
import { Typography, Card, CardContent, Button, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models";

import "./styles.css";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const { userId } = useParams();
    
    // Get user data from models
    const user = models.userModel(userId);
    
    if (!user) {
        return (
            <Typography variant="h6" color="error">
                User not found
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {user.first_name} {user.last_name}
                    </Typography>
                    
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        User Details
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" paragraph>
                            <strong>Location:</strong> {user.location}
                        </Typography>
                        
                        <Typography variant="body1" paragraph>
                            <strong>Occupation:</strong> {user.occupation}
                        </Typography>
                        
                        <Typography variant="body1" paragraph>
                            <strong>Description:</strong> {user.description}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 3 }}>
                        <Button
                            component={Link}
                            to={`/photos/${userId}`}
                            variant="contained"
                            color="primary"
                        >
                            View Photos of {user.first_name}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default UserDetail;