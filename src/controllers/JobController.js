const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')


module.exports = {

  create(req, res) {
    return res.render("job")
  },

  async save(req, res) {
           
    await Job.create({      
      
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now()
    })  

    // redireciona para o index
    return res.redirect('/')
z
  },

  async show(req, res) {

    // esse .id deve ser o mesmo passado no url da rota     
    // req.params recebe o id do botao enviado pela url na requisiçao
    const jobId = req.params.id
    const jobs = await Job.get()


    // se o find encontrar o job.id === jobId, 
    // ele retorna para o vetor job criado
    const job = jobs.find(job => Number(job.id) === Number(jobId))

    if (!job) {
      return res.send('Job not found!')
    }
    
    const profile = await Profile.get()

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

    return res.render("job-edit", { job })
  },

  async update(req, res) {

    // esse .id deve ser o mesmo passado no url da rota     
    // req.params recebe o id do botao enviado pela url na requisiçao
    const jobId = req.params.id
    

    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body['total-hours'],
      "daily-hours": req.body['daily-hours'],
    }
        
    await Job.update(updatedJob, jobId)

    res.redirect('/')

  },

  async delete(req, res) {
    const jobId = req.params.id    
   
    await Job.delete(jobId)    
   
    return res.redirect('/')
  }
}
