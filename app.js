const express = require('express');
const userRoutes = require('./routes/userRoutes');
const userFamilyRoutes = require('./routes/userFamilyRoutes');

const app = express();

app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/addfamily', userFamilyRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
