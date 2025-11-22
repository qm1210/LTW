import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Card, CardContent, Box, Grid } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

// Load images from src/images
const imagesCtx = require.context("../../images", false, /\.(png|jpe?g|gif|webp|svg)$/);
const getImage = (fileName) => {
  try {
    return imagesCtx(`./${fileName}`);
  } catch {
    return null;
  }
};

function fmt(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return String(dt);
  }
}

/**
 * UserComments component - displays all comments made by a specific user
 */
function UserComments() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [userComments, setUserComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        
        // Fetch user data
        fetchModel(`/user/${userId}`)
            .then((userData) => {
                setUser(userData);
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
                setUser(null);
            });

        // Fetch all users to get all their photos
        fetchModel("/user/list")
            .then(async (userList) => {
                const commentsWithPhotos = [];
                
                // Fetch photos for all users
                await Promise.all(
                    userList.map(async (u) => {
                        try {
                            const photos = await fetchModel(`/photosOfUser/${u._id}`);
                            
                            photos.forEach(photo => {
                                if (photo.comments) {
                                    // Find comments by this user
                                    const userCommentsInPhoto = photo.comments.filter(
                                        comment => comment.user._id === userId
                                    );
                                    
                                    // Add photo info to each comment
                                    userCommentsInPhoto.forEach(comment => {
                                        commentsWithPhotos.push({
                                            ...comment,
                                            photo: {
                                                _id: photo._id,
                                                file_name: photo.file_name,
                                                user_id: photo.user_id
                                            }
                                        });
                                    });
                                }
                            });
                        } catch (error) {
                            console.error(`Error fetching photos for user ${u._id}:`, error);
                        }
                    })
                );
                
                // Sort comments by date (newest first)
                commentsWithPhotos.sort((a, b) => 
                    new Date(b.date_time) - new Date(a.date_time)
                );
                
                setUserComments(commentsWithPhotos);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching comments:", error);
                setLoading(false);
            });
    }, [userId]);

    if (loading) {
        return (
            <Typography variant="h6" sx={{ p: 2 }}>
                Loading...
            </Typography>
        );
    }

    if (!user) {
        return (
            <Typography variant="h6" color="error" sx={{ p: 2 }}>
                User not found
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Comments by {user.first_name} {user.last_name}
            </Typography>
            
            {userComments.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No comments yet.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {userComments.map((comment) => {
                        const imgSrc = getImage(comment.photo.file_name);
                        
                        return (
                            <Grid item xs={12} key={comment._id}>
                                <Card 
                                    elevation={2}
                                    component={Link}
                                    to={`/photos/${comment.photo.user_id}`}
                                    sx={{ 
                                        textDecoration: 'none',
                                        display: 'block',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 4
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            {/* Thumbnail */}
                                            <Box
                                                sx={{
                                                    flexShrink: 0,
                                                    width: 120,
                                                    height: 120,
                                                    overflow: 'hidden',
                                                    borderRadius: 1,
                                                    backgroundColor: '#f5f5f5'
                                                }}
                                            >
                                                {imgSrc ? (
                                                    <img
                                                        src={imgSrc}
                                                        alt={comment.photo.file_name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#999'
                                                        }}
                                                    >
                                                        No image
                                                    </Box>
                                                )}
                                            </Box>
                                            
                                            {/* Comment content */}
                                            <Box sx={{ flex: 1 }}>
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        mb: 1,
                                                        color: 'text.primary'
                                                    }}
                                                >
                                                    {comment.comment}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                >
                                                    {fmt(comment.date_time)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
}

export default UserComments;
