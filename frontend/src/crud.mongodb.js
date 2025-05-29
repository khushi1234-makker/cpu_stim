use('Crud')
db.createCollection('Ranjot')
db.Ranjot.insertOne
    (
        {
        name: 'Ranjot',
        age: 25,
        gender: 'Male',
        
    })
db.Ranjot.insertMany([
    {
        name: 'Ranjot',
        age: 25,
        gender: 'Male',
        
    },
    {
        name: 'Ranjot',
        age: 21,
        gender: 'Male',
        
    }
])
db.Ranjot.find({age:21})

db.Ranjot.updateOne({age:21},{$set:{age:30}})
db.Ranjot.updateMany({age:21},{$set:{age:30}})
db.Ranjot.deleteOne({age:21},{$set:{age:30}})