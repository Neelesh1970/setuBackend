const express = require('express');
const userRoutes = require('./routes/userRoutes');
const userFamilyRoutes = require('./routes/userFamilyRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userJobProfileRoutes = require('./routes/userJobProfileRoutes')

const app = express();

app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/addfamily', userFamilyRoutes);
app.use('/api', ticketRoutes);
app.use('/api/job', userJobProfileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
