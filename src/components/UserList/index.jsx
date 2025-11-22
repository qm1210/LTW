import React, { useEffect, useState } from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
    Box,
    Badge
} from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
    const [users, setUsers] = useState([]);
    const [userStats, setUserStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchModel("/user/list")
            .then(async (userList) => {
                setUsers(userList);
                
                // Fetch stats for each user
                const stats = {};
                await Promise.all(
                    userList.map(async (user) => {
                        try {
                            const photos = await fetchModel(`/photosOfUser/${user._id}`);
                            const photoCount = photos.length;
                            
                            // Count comments by this user
                            let commentCount = 0;
                            const allPhotosPromises = userList.map(u => 
                                fetchModel(`/photosOfUser/${u._id}`).catch(() => [])
                            );
                            const allPhotos = await Promise.all(allPhotosPromises);
                            
                            allPhotos.flat().forEach(photo => {
                                if (photo.comments) {
                                    commentCount += photo.comments.filter(
                                        c => c.user._id === user._id
                                    ).length;
                                }
                            });
                            
                            stats[user._id] = { photoCount, commentCount };
                        } catch (error) {
                            console.error(`Error fetching stats for user ${user._id}:`, error);
                            stats[user._id] = { photoCount: 0, commentCount: 0 };
                        }
                    })
                );
                
                setUserStats(stats);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user list:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div>
                <Typography variant="h6" sx={{ p: 2 }}>
                    Users
                </Typography>
                <Divider />
                <Typography sx={{ p: 2 }}>Loading...</Typography>
            </div>
        );
    }

    return (
        <div>
            <Typography variant="h6" sx={{ p: 2 }}>
                Users
            </Typography>
            <Divider />
            <List component="nav">
                {users.map((user) => {
                    const stats = userStats[user._id] || { photoCount: 0, commentCount: 0 };
                    return (
                        <ListItem key={user._id} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={`/users/${user._id}`}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <ListItemText
                                    primary={`${user.first_name} ${user.last_name}`}
                                />
                                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                    {/* Green bubble - Photo count */}
                                    <Box
                                        sx={{
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: 28,
                                            height: 28,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {stats.photoCount}
                                    </Box>
                                    
                                    {/* Red bubble - Comment count (clickable) */}
                                    <Box
                                        component={Link}
                                        to={`/comments/${user._id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: 28,
                                            height: 28,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                backgroundColor: '#d32f2f'
                                            }
                                        }}
                                    >
                                        {stats.commentCount}
                                    </Box>
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}

export default UserList;