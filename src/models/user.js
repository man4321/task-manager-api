
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Task = require('./task');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('this is not secure password....')
            }

        }
    },
    age: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('this is email is not valid....')
            }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }

    }],
    avatar: {
        type: Buffer

    }
},
    {
        timestamps: true
    }
);

//virtual add of task in user schema

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})



// for hide password and tokens in response.....
userSchema.methods.toJSON = function () {
    const user = this;
    const obj = user.toObject();
    delete obj.password;
    delete obj.tokens;
    delete obj.avatar;
    return obj;
}


//for login.....
userSchema.statics.findByCredentials = async (User, email, password) => {
    const user = await User.findOne({ email });
    console.log(user)

    if (!user) throw new Error("Unable to login!!!");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new Error("Unable to login!!!");
    return user;


}
//login token creation...
userSchema.methods.genrateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN_SIGN);
    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token;
}

// we can't use arrow function here because of binding issue....
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()

})
// for deleting all tasks when removeing a user....
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });


    next();
})

const user = mongoose.model('user', userSchema)

module.exports = user;