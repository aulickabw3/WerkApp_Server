var express = require("express");
var router = express.Router();
const { check, validationResult } = require('express-validator');
var models = require("../models");
var authService = require("../services/auth");
// const { BOOLEAN } = require("sequelize");
const { Sequelize, Op } = require("sequelize");
const { sequelize } = require("../models");


// @route   POST
// @descr   Create a job (header)
// @access  PRIVATE (TODO)
router.post("/CreateJob", async (req, res) => {
    
  
  try {
      console.log(typeof req.body.newJob.NumberOfWerkers);
      for (let i = 0; i < req.body.newJob.NumberOfWerkers; i++) {
        
        console.log("count it");
        
        let createAShift = await models.jobshifts.findOrCreate({
          where: {
            SchedulerJobId: req.body.newJob.JobID,
            DateDay: req.body.newJob.Date,
            StartDateTime: req.body.newJob.BeginTime,
            FinishDateTime: req.body.newJob.EndTime,
            Company: req.body.newJob.Company,
            Location: req.body.newJob.Location,
            Pay: req.body.newJob.Pay,
            ShiftNotes: req.body.newJob.Notes,  
            Scheduler_Users_UserId: req.body.newJob.UserId,
            NumberOfWerkers: i
          },
          defaults: {
            SchedulerJobId: req.body.newJob.JobID,
            DateDay: req.body.newJob.Date,
            StartDateTime: req.body.newJob.BeginTime,
            FinishDateTime: req.body.newJob.EndTime,
            Company: req.body.newJob.Company,
            Location: req.body.newJob.Location,
            Pay: req.body.newJob.Pay,
            ShiftNotes: req.body.newJob.Notes,  
            Scheduler_Users_UserId: req.body.newJob.UserId,
            NumberOfWerkers: ""
          }
        })
      }
      


      res.json({"it worked":"sweet!"});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  

// @route   POST
// @descr   Create a job shift (line items)
// @access  PRIVATE (TODO)
// router.post("/CreateAShift", async (req, res) => {
//     try {
//       let createAShift = await models.jobshifts.findOrCreate({
//         where: {
//             POCName: req.body.newShift.POCName,
//             POCPhone: req.body.newShift.POCPhone,
//             Pay: req.body.newShift.Pay,
//             StartDateTime: req.body.newShift.StartDateTime,
//             FinishDateTime: req.body.newShift.FinishDateTime,
//             ShiftNotes: req.body.newShift.ShiftNotes,
//             SchedulerApproval: req.body.newShift.SchedulerApproval,
//             UserUserId: req.body.newShift.UserUserId,
//             JobJobId: req.body.newShift.JobJobId
//         }
//       });
//       res.json({createAShift});
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   });


// @route   POST
// @descr   Publish a job (make it available) to all associates
// @access  PRIVATE (TODO)
router.post("/PublishJob", async (req, res) => {
    
  //  have to determine if job is available to:
  //   - all scheduler's associates
  //   - a scheduler's crew
  //   - just certain associates
  
  //  All associates
  //  1 - Get list of all scheduler's associates
  try {
    let schedulersAssociates = await models.businessassociate.findAll({
      where: {
        a_Users_UserId: req.body.schedulerProfile.UserId
      },
      attributes: {
        exclude: ['BusinessAssociateId', 'a_Users_UserId','RequestStatus', 'createdAt', 'updatedAt']
      }
    })
  
//  2 - Publish to those associates
  for (let i = 0; i < schedulersAssociates.length; i++) {
    let publishJob = await models.availablejobs.findOrCreate({
      where: {
        UserUserId: schedulersAssociates[i].b_Users_UserId,
        JobJobId: req.body.publishJob.JobJobId
      }
    })
  }

      res.json({schedulersAssociates});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  


  module.exports = router;