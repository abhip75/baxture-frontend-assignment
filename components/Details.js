"use client";

import React,{useState, useEffect} from "react";
import axios from "axios";
import { Container, Grid, Card, Text, Avatar, Button, Tooltip } from "@mantine/core";
import "../style/Details.css";
import { IconAt, IconPhoneCall, IconWorld, IconUsersPlus, IconUsersMinus, IconTrash, IconStar} from '@tabler/icons-react';
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Details = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/users")
        .then(response => {
            setUsers(response.data);
            console.log("Users Data", response.data);
        })
        .catch(error => {
            console.log("Error fetching the data", error);
        })
    },[])

    const generateProfileImageUrl = (name) => {
        const encodedName = encodeURIComponent(name);
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}`;
      };

      const handleDelete = async(id) => {
        try{
            await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
            console.log("User deleted");
            setUsers(prevUser => prevUser.filter(user => user.id !==id));
            toast.success("User Deleted", {
                position: "bottom-right",
                autoClose: 3000
            });
        } catch(error){
            console.log("Error deleting user", error);
        }
      }

      const handleFollow = (id) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if(user.id === id){
                return {...user, following:!user.following};
            }
            return user;
        }));
      };

    return(
        <Container className="container">
            <ToastContainer />
            <Grid>
                {users.map((user, key) => (
                <Grid.Col key={user.id} span={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <div className="card-container">
                        <Card shadow="lg" padding="md" radius="md" className="main-card">
                            <div align="center">
                                <Tooltip label={user.name} position="top" withArrow>
                                    <Avatar 
                                    src={generateProfileImageUrl(user.name)}
                                    alt={`Profile image of ${user.name}`}
                                    className="user-avatar"
                                    />
                                </Tooltip>
                            </div>
                            <Text size="xl" align="center" className="header-text">
                                {user.name}
                                {user.following && <IconStar className="star-icon" size={17} />}
                            </Text>
                            <div className="user-information">
                                <div className="text-icons">
                                   <IconAt size={17} className="muted-text"/>
                                    <Link href={`mailto:${user.email}`} target="_blank" className="email-link"><strong><Text className="email-text muted-text">{user.email}</Text></strong></Link>
                                </div>
                                <div className="text-icons">
                                    <IconPhoneCall size={17} className="muted-text" />
                                    <Link href={`tel:${user.phone}`} target="_blank" className="phone-link"><Text className="phone-text muted-text">{user.phone}</Text></Link>
                                </div>
                                <div className="text-icons">
                                    <IconWorld size={17} className="muted-text" />
                                    <Link href={user.website} target="_blank" className="website-link"><Text className="website-text muted-text">{user.website}</Text></Link>
                                </div>
                            </div>
                            <div align="center" className="buttons">
                                <Button className={`user-button ${user.following ? 'unfollow-button' : ''}`} onClick={() => handleFollow(user.id)}>
                                    {user.following ? 
                                        <IconUsersMinus size={17} className="user-minus" /> :
                                        <IconUsersPlus size={17} className="user-plus" />
                                    }
                                    {user.following ? "Unfollow" : "Follow"}
                                </Button>
                                <Button className="delete-button" onClick={()=>handleDelete(user.id)}><IconTrash size={17}/>Delete</Button>
                            </div>
                        </Card>
                    </div>
                </Grid.Col>

                ))}
            </Grid>
        </Container>
    )
}

export default Details;