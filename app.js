const express = require('express')
const loki = require('lokijs')
const bodyparser = require('body-parser')
const multer = require('multer')
var upload = multer()

const app = express()
const port = 3000
const db = new loki('loki.json')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

/****** /project */
app.get('/project', (req,res) => {        
    if(isSearch(req.query)){
        get(req.query, res)
    }

    db.loadDatabase({}, () => {
        let projects = db.getCollection('project')
        if(!projects){
            console.log(`Collection "project" does not exist.`)
            return res.sendStatus(404)
        }

        let result = projects.findObjects()
        return res.status(200).send(result)
    })
})

app.post('/project', upload.array(), (req, res, next) => {
    db.loadDatabase({}, () => {
        let projects = db.getCollection('project')
        if(!projects){
            projects = db.addCollection('project', {
                unique: ['Name']
            })

            if(!projects){
                console.log(`Collection "project" does not exist.`)
                return res.sendStatus(500)
            }
        }

        let project = projects.findOne({ 'Name': req.body.name })
        if(project){
            return res.status(500).send(`Object named ${req.body.name} already exists.`)
        }

        project = projects.insert({
            'Name': req.body.name,
            'Owner': req.body.owner,
            'Description': req.body.description,
            'Work Type': req.body.workType,
            'Deadline': req.body.deadline,
            'Maximum Budget': req.body.maximumBudget,
            'Lowest Bid': null,
            'Lowest Bidder': null
        })

        if(!project){
            return res.sendStatus(500)
        }
        project.ID = project['$loki']
        projects.update(project)
        console.log(project)

        db.saveDatabase(err => handleError(err, res))
        return res.status(200).send(project)
    })
})

app.get('/project/:projectId', (req, res) => {
    db.loadDatabase({}, () =>{
        let projects = db.getCollection('project')
        if(!projects){
            return res.sendStatus(404)
        }

        let project = projects.findOne({ 'ID': Number(req.params.projectId) })
        if(!project){
            return res.sendStatus(404)
        }

        return res.status(200).send(project)
    })
}) 

/****** 
 *  /bid 
 ******/
app.get('/bid', (req, res) => {
    db.loadDatabase({}, () => {
        let bids = db.getCollection('bid')
        if(!bids){
            return res.sendStatus(404)
        }
        
        let result = bids.findObjects()
        return res.status(200).send(result)
    })
})

app.post('/bid', upload.array(), (req, res, next) => {
    db.loadDatabase({}, () => {
        let projects = db.getCollection('project')
        if(!projects){
            return res.sendStatus(500)
        }

        let project = projects.findOne({ 'ID': Number(req.body.projectId)})
        if(!project){
            return res.status(404).send(`Project with ID ${req.body.projectId} not found.`)
        }

        let bids = db.getCollection('bid')
        if(!bids){
            bids = db.addCollection('bid')
            if(!bids){
                return res.sendStatus(500)
            }
        }

        let bid = bids.insert({
            projectId: Number(req.body.projectId),
            bid: Number(req.body.bid),
            bidder: req.body.bidder
        })

        if(!bid){
            return res.sendStatus(500)
        }

        db.saveDatabase(err => handleError(err, res))
        return res.status(200).send(bid)
    })
})

/****** 
 * Start the server
 */
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function isSearch(query){
    return !(query.projectId == undefined && query.name == undefined && query.workType == undefined && query.deadline == undefined)
}

function get(params, res){
    db.loadDatabase({}, () => {
        var projects = db.getCollection('project')
        if(!projects){
            return res.sendStatus(500)
        }

        if(params.projectId){
            let project = projects.findOne({ 'ID': Number(params.projectId) })
            if(!project){
                return res.sendStatus(404)
            }

            return res.status(200).send(project)
        }

        let nameQuery = null
        if(params.name){
            nameQuery = {
                'Name': { '$regex': params.name }
            }
        }

        let workTypeQuery = null
        if(params.workType){
            workTypeQuery = {
                'Work Type': { '$regex': params.workType }
            }
        }

        let excludePastDeadlineQuery = null
        if(params.excludePastDeadline){
            pastDeadlineQuery = {
                'Deadline': { '$gt': Date.now()}
            }
        }

        let query = {
            '$or': []
        }
        if(nameQuery) query['$or'].push(nameQuery)
        if(workTypeQuery) query['$or'].push(workTypeQuery)
        if(excludePastDeadlineQuery) query['$or'].push(excludePastDeadlineQuery)

        console.log(query)

        var result = projects.find(query)
        if(!result){
            return res.sendStatus(404)
        }

        console.log(result)
        return res.status(200).send(result)
    })    
}

function handleError(err, res){
    if(err){        
        return res.sendStatus(500)
    }
    else {
        console.log('database saved')
    }
}
