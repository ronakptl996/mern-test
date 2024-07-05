import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Grid } from "@mui/material";
import ArticleCard from "../../components/ArticleCard";
import { fetchAllArticles } from "../../features/auth/authSlice";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("desc");

  const dispatch = useDispatch();

  const { articles } = useSelector((state) => state.auth);

  const fetchArticles = async () => {
    try {
      let url = '/api/article';
      if (searchQuery) {
        url += `/search?q=${encodeURIComponent(searchQuery)}`;
      } else if (sortBy) {
        url += `/sort?sortBy=${sortBy}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    dispatch(fetchAllArticles());
  }, [dispatch]);

  return (
    <Container>
      <Grid container spacing={2}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={article._id}>
            <ArticleCard {...article} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
