const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')


module.exports = {

  index(req, res) {
    const Jobs = Job.get()
    const profile = Profile.get()


    const updatedJobs = Jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job)
      const status = remaining <= 0 ? 'done' : 'progress'
      // ajustes no jobs 
      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"])
      }
    })

    return res.render("index", { jobs: updatedJobs })

  },

  create(req, res) {
    return res.render("job")
  },

  save(req, res) {

    const jobs = Job.get()

    const lastId = jobs[jobs.length - 1]?.id || 0;

    // salva os dados do body da requisição no array de jobs
    jobs.push({
      id: lastId + 1,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now()
    })

    // redireciona para o index
    return res.redirect('/')
z
  },

  show(req, res) {

    // esse .id deve ser o mesmo passado no url da rota     
    // req.params recebe o id do botao enviado pela url na requisiçao
    const jobId = req.params.id
    const jobs = Job.get()


    // se o find encontrar o job.id === jobId, 
    // ele retorna para o vetor job criado
    const job = jobs.find(job => Number(job.id) === Number(jobId))

    if (!job) {
      return res.send('Job not found!')
    }
    
    const profile = Profile.get()

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

    return res.render("job-edit", { job })
  },

  update(req, res) {

    // esse .id deve ser o mesmo passado no url da rota     
    // req.params recebe o id do botao enviado pela url na requisiçao
    const jobId = req.params.id
    const jobs = Job.get()

    // se o find encontrar o job.id === jobId, 
    // ele retorna para o vetor job criado
    const job = jobs.find(job => Number(job.id) === Number(jobId))

    if (!job) {
      return res.send('Job not found!')
    }

    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body['total-hours'],
      "daily-hours": req.body['daily-hours'],
    }

    // atualizar o Job.data com os dados do updatedJob 

    const newJobs = jobs.map(job => {

      if (Number(job.id) === Number(jobId)) {
        job = updatedJob
      }
      return job
    })

    Job.update(newJobs)


    res.redirect('/job/' + jobId)

  },

  delete(req, res) {
    const jobId = req.params.id
    
   
    Job.delete(jobId)    

   
    return res.redirect('/')
  }

}
