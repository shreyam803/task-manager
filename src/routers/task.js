const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/authentication');

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }


});
// GET /tasks?limit=10&skip=20 -- 10 tasks of third web page skip=0 means first webpage
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1
    }

    if (req.query.completed) {           //GET /tasks?completed=true/false
        match.completed = req.query.completed === 'true'
    }
    try {
        //const tasks = await Task.find({owner:req.user._id});
        //res.send(tasks);

        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort              // 1 for ascending order and -1 for descending order                
            }
        }).execPopulate();
        res.send(req.user.tasks);
    }
    catch (e) {
        res.status(400).send();
    }

})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    }
    catch (e) {
        res.status(500).send();
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdateProperties = ['description', 'completed'];
    const isValidProperty = updates.every((update) => allowedUpdateProperties.includes(update));

    if (!isValidProperty) {
        return res.status(400).send({ error: 'Inavlid Updates' })
    }

    try {

        //const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save();

        res.send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch (e) {
        res.status(500).send();
    }

})
module.exports = router;