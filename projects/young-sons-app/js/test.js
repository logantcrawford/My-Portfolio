import axios from 'axios';

username = 'Logantcrawford'
axios.get('https://api.github.com/users/' + username)
  .then(function(response){
    console.log(response.data); // ex.: { user: 'Your User'}
    console.log(response.status); // ex.: 200
  });  


/*
const BASE_URL = 'https://jsonplaceholder.typicode.com';

const getTodos = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/todos`);

    const todos = res.data;

    console.log(`GET: Here's the list of todos`, todos);

    return todos;
  } catch (e) {
    console.error(e);
  }
};
console.log(getTodos);*/