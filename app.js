const express = require('express');
const userRoutes = require('./routes/userRoutes');
const userFamilyRoutes = require('./routes/userFamilyRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userJobProfileRoutes = require('./routes/userJobProfileRoutes')
const doctorRoutes = require('./routes/doctorRoutes');
const contactRoutes = require('./routes/contactRoutes');
const jobs = require('./routes/jobRoutes');
const fitness = require('./routes/fitnessRoutes');

const app = express();

app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/addfamily', userFamilyRoutes);
app.use('/api', ticketRoutes);
app.use('/api/job', userJobProfileRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/jobs', jobs);
app.use('/api/fitness', fitness);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
