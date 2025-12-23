const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');
const Job = require('../models/Job');
const Admin = require('../models/Admin');

// Sample users with complete data
const sampleUsers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    password: 'User@1234',
    phone: '+91-9876543210',
    gender: 'Male',
    experience: 5,
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'REST API', 'Git', 'Docker']
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'User@1234',
    phone: '+91-9876543211',
    gender: 'Female',
    experience: 3,
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Data Analysis', 'Machine Learning']
  },
  {
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    password: 'User@1234',
    phone: '+91-9876543212',
    gender: 'Male',
    experience: 7,
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes', 'Jenkins', 'MySQL']
  },
  {
    name: 'Sneha Gupta',
    email: 'sneha.gupta@example.com',
    password: 'User@1234',
    phone: '+91-9876543213',
    gender: 'Female',
    experience: 2,
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI/UX Design', 'Figma']
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'User@1234',
    phone: '+91-9876543214',
    gender: 'Male',
    experience: 4,
    skills: ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'REST API', 'Redis']
  },
  {
    name: 'Ananya Reddy',
    email: 'ananya.reddy@example.com',
    password: 'User@1234',
    phone: '+91-9876543215',
    gender: 'Female',
    experience: 0,
    skills: ['C++', 'Data Structures', 'Algorithms', 'Problem Solving']
  },
  {
    name: 'Karthik Menon',
    email: 'karthik.menon@example.com',
    password: 'User@1234',
    phone: '+91-9876543216',
    gender: 'Male',
    experience: 6,
    skills: ['DevOps', 'AWS', 'Azure', 'Terraform', 'Ansible', 'CI/CD']
  },
  {
    name: 'Divya Nair',
    email: 'divya.nair@example.com',
    password: 'User@1234',
    phone: '+91-9876543217',
    gender: 'Female',
    experience: 1,
    skills: ['React Native', 'JavaScript', 'Mobile Development', 'Firebase']
  }
];

// Sample jobs with complete data
const sampleJobs = [
  {
    title: 'Senior Full Stack Developer',
    companyName: 'Tech Innovations Pvt Ltd',
    location: 'Bangalore',
    salary: 1800000,
    experienceRequired: 5,
    jobType: 'Full-time',
    description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be working on cutting-edge web applications using modern technologies.',
    requirements: ['5+ years experience in web development', 'Strong proficiency in React and Node.js', 'Experience with MongoDB', 'Good understanding of RESTful APIs', 'Experience with Git and CI/CD']
  },
  {
    title: 'Python Developer',
    companyName: 'DataTech Solutions',
    location: 'Hyderabad',
    salary: 1200000,
    experienceRequired: 3,
    jobType: 'Full-time',
    description: 'Join our team as a Python Developer to build scalable backend systems and data pipelines.',
    requirements: ['3+ years Python experience', 'Experience with Django or Flask', 'Knowledge of PostgreSQL', 'Understanding of data structures and algorithms', 'AWS experience is a plus']
  },
  {
    title: 'Java Architect',
    companyName: 'Enterprise Systems Inc',
    location: 'Pune',
    salary: 2500000,
    experienceRequired: 8,
    jobType: 'Full-time',
    description: 'We are seeking a Java Architect to design and implement enterprise-level applications using microservices architecture.',
    requirements: ['8+ years Java development', 'Strong experience with Spring Boot', 'Microservices architecture expertise', 'Experience with Kubernetes and Docker', 'Leadership and mentoring skills']
  },
  {
    title: 'Frontend Developer',
    companyName: 'Creative Digital Agency',
    location: 'Mumbai',
    salary: 900000,
    experienceRequired: 2,
    jobType: 'Full-time',
    description: 'Looking for a creative Frontend Developer to build beautiful and responsive user interfaces.',
    requirements: ['2+ years frontend experience', 'Strong knowledge of HTML, CSS, JavaScript', 'Experience with React', 'Understanding of UI/UX principles', 'Portfolio of previous work required']
  },
  {
    title: 'PHP Laravel Developer',
    companyName: 'Web Solutions Pro',
    location: 'Delhi',
    salary: 1000000,
    experienceRequired: 4,
    jobType: 'Full-time',
    description: 'We need an experienced PHP Laravel developer to maintain and enhance our existing applications.',
    requirements: ['4+ years PHP development', 'Strong Laravel framework knowledge', 'Experience with MySQL', 'RESTful API development', 'Version control with Git']
  },
  {
    title: 'Software Engineer Trainee',
    companyName: 'Tech Start Solutions',
    location: 'Bangalore',
    salary: 400000,
    experienceRequired: 0,
    jobType: 'Internship',
    description: 'Freshers welcome! Join our training program and kickstart your career in software development.',
    requirements: ['Recent graduate in Computer Science or related field', 'Strong fundamentals in programming', 'Knowledge of C++, Java, or Python', 'Eagerness to learn', 'Good problem-solving skills']
  },
  {
    title: 'DevOps Engineer',
    companyName: 'Cloud Infrastructure Corp',
    location: 'Gurgaon',
    salary: 1600000,
    experienceRequired: 5,
    jobType: 'Full-time',
    description: 'Join our DevOps team to manage and automate cloud infrastructure using modern DevOps practices.',
    requirements: ['5+ years DevOps experience', 'Strong knowledge of AWS/Azure', 'Experience with Terraform and Ansible', 'CI/CD pipeline setup', 'Container orchestration with Kubernetes']
  },
  {
    title: 'React Native Developer',
    companyName: 'Mobile First Technologies',
    location: 'Chennai',
    salary: 800000,
    experienceRequired: 2,
    jobType: 'Full-time',
    description: 'Build cross-platform mobile applications using React Native for iOS and Android.',
    requirements: ['2+ years mobile development', 'Strong React Native experience', 'JavaScript/TypeScript proficiency', 'Experience with Firebase or similar backend', 'Published apps on App Store/Play Store']
  },
  {
    title: 'Data Scientist',
    companyName: 'AI Analytics Labs',
    location: 'Bangalore',
    salary: 1500000,
    experienceRequired: 3,
    jobType: 'Full-time',
    description: 'Work on exciting machine learning projects and build data-driven solutions for our clients.',
    requirements: ['3+ years data science experience', 'Strong Python and ML libraries knowledge', 'Experience with TensorFlow or PyTorch', 'Statistical analysis skills', 'Experience with big data tools']
  },
  {
    title: 'UI/UX Designer',
    companyName: 'Design Studio Pro',
    location: 'Mumbai',
    salary: 1100000,
    experienceRequired: 3,
    jobType: 'Full-time',
    description: 'Create stunning user interfaces and exceptional user experiences for web and mobile applications.',
    requirements: ['3+ years UI/UX design experience', 'Proficiency in Figma and Adobe XD', 'Strong portfolio demonstrating design skills', 'Understanding of user research', 'Knowledge of HTML/CSS is a plus']
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Admin.deleteMany({ isDefault: { $ne: true } }); // Keep default admin
    console.log('✅ Existing data cleared\n');

    // Create default admin if not exists
    console.log('👨‍💼 Creating default admin...');
    const existingAdmin = await Admin.findOne({ isDefault: true });
    let adminId;
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, salt);
      const defaultAdmin = new Admin({
        username: process.env.DEFAULT_ADMIN_USERNAME,
        password: hashedPassword,
        isDefault: true,
      });
      const savedAdmin = await defaultAdmin.save();
      adminId = savedAdmin._id;
      console.log(`✅ Default admin created: ${process.env.DEFAULT_ADMIN_USERNAME}\n`);
    } else {
      adminId = existingAdmin._id;
      console.log(`✅ Default admin already exists: ${existingAdmin.username}\n`);
    }

    // Create users
    console.log('👥 Creating sample users...');
    const salt = await bcrypt.genSalt(10);
    const usersToInsert = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, salt)
      }))
    );
    const createdUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create jobs
    console.log('💼 Creating sample jobs...');
    const jobsToInsert = sampleJobs.map(job => ({
      ...job,
      postedBy: adminId
    }));
    const createdJobs = await Job.insertMany(jobsToInsert);
    console.log(`✅ Created ${createdJobs.length} jobs\n`);

    // Apply some users to some jobs
    console.log('📝 Creating sample applications...');
    let applicationCount = 0;
    
    // User 0 applies to jobs 0, 1, 2
    for (let i = 0; i < 3; i++) {
      await Job.findByIdAndUpdate(createdJobs[i]._id, {
        $push: {
          applicants: {
            userId: createdUsers[0]._id,
            status: i === 0 ? 'Accepted' : i === 1 ? 'Pending' : 'Rejected'
          }
        }
      });
      await User.findByIdAndUpdate(createdUsers[0]._id, {
        $push: {
          appliedJobs: {
            jobId: createdJobs[i]._id
          }
        }
      });
      applicationCount++;
    }

    // User 1 applies to jobs 1, 3
    for (let i of [1, 3]) {
      await Job.findByIdAndUpdate(createdJobs[i]._id, {
        $push: {
          applicants: {
            userId: createdUsers[1]._id,
            status: 'Pending'
          }
        }
      });
      await User.findByIdAndUpdate(createdUsers[1]._id, {
        $push: {
          appliedJobs: {
            jobId: createdJobs[i]._id
          }
        }
      });
      applicationCount++;
    }

    // User 5 (fresher) applies to job 5 (internship)
    await Job.findByIdAndUpdate(createdJobs[5]._id, {
      $push: {
        applicants: {
          userId: createdUsers[5]._id,
          status: 'Pending'
        }
      }
    });
    await User.findByIdAndUpdate(createdUsers[5]._id, {
      $push: {
        appliedJobs: {
          jobId: createdJobs[5]._id
        }
      }
    });
    applicationCount++;

    console.log(`✅ Created ${applicationCount} sample applications\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Jobs: ${createdJobs.length}`);
    console.log(`   - Applications: ${applicationCount}`);
    console.log(`   - Admin: ${process.env.DEFAULT_ADMIN_USERNAME}`);
    console.log('\n💡 Test Credentials:');
    console.log(`   User: rajesh.kumar@example.com / User@1234`);
    console.log(`   Admin: ${process.env.DEFAULT_ADMIN_USERNAME} / ${process.env.DEFAULT_ADMIN_PASSWORD}\n`);

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
