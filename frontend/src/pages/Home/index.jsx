import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Grid, TextField } from "@mui/material";
import { setArticles } from "../../features/auth/authSlice";
import ArticleCard from "../../components/ArticleCard";
import { debounce } from "../../utils";

const Home = () => {
  const { articles } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("desc");

  const fetchArticles = async () => {
    try {
      const response = await fetch(
        `/api/article/search?q=${searchQuery}&sortBy=${sortBy}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      dispatch(setArticles(data.data));
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const debouncedFetchArticles = useCallback(debounce(fetchArticles, 500), [
    searchQuery,
    sortBy,
  ]);

  useEffect(() => {
    debouncedFetchArticles();
  }, [debouncedFetchArticles]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const handleSortByDate = (sortOrder) => {
    setSortBy(sortOrder);
  };

  return (
    <Container>
      <TextField
        label="Search Articles"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: "1rem" }}
      />
      <Button onClick={() => handleSortByDate("asc")}>
        Sort by Date Ascending
      </Button>
      <Button onClick={() => handleSortByDate("desc")}>
        Sort by Date Descending
      </Button>
      <Grid container spacing={2}>
        {articles?.map((article) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={article._id}>
            <ArticleCard {...article} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
