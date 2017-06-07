const exec = require('child_process').exec;

const USER = 'g2_324f_38vK_D',
      PASS = 'password123',
      FIRST = 'firstname',
      LAST = 'lastname',
      EMAIL = 'email@email.com',
      FEED_NAME = 'MyFeed',
      SUBREDDIT = 'all',
      UPDATED_SUBREDDIT = 'aww';

let X_Aggregor_Token,
    plugin_id;

const command = (args) => {
    return new Promise((resolve, reject) => {
        let commandString = 'bash scripts/' + args[0] + '.sh';
        let printString = args[0];
        for (let i = 1; i < args.length; i++) {
            commandString += ' ' + args[i];
            if (/[a-z0-9-]{36}/.test(args[i])) {
                printString += ' [id]';
            } else if (/[a-zA-Z0-9_.]{64}/.test(args[i])) {
                printString += ' [token]';
            } else {
                printString += ' ' + args[i];
            }
        }

        console.log("cmd: " + printString);
        exec(commandString, (err, out, code) => {
            if (err) {
                reject("Error while running: " + commandString + ":" + code);
            } else {
                const res = JSON.parse(out);
                if (res.code === 200) {
                    resolve(res);
                } else {
                    reject(res);
                }
            }
        });
    });
};

const loginUser = () => {
    return command(['login_user', USER, PASS])
    .then((res) => {
        X_Aggregor_Token = res.data.token;
        return Promise.resolve();
    });
};

const deleteExistingUser = () => {
    return loginUser()
    .then((res) => {
        return command(['delete_user', X_Aggregor_Token, USER, PASS]);
    }, (err) => {
        if (err.code === 401) {
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    });
};

deleteExistingUser()
.then(() => {
    return command(['new_user', USER, PASS, EMAIL, FIRST, LAST])
    .then((res) => {
        X_Aggregor_Token = res.data.token;
        return Promise.resolve();
    });
})
.then(() => {
    return loginUser();  
})
.then(() => {
    return command(['create_feed', X_Aggregor_Token, USER, FEED_NAME]);
})
.then(() => {
    return command(['fetch_feeds', X_Aggregor_Token, USER, FEED_NAME])
    .then((res) => {
        console.log("FEEDS:", res.data.feedNames);
        return Promise.resolve();
    });
})
.then(() => {
    return command(['add_plugin', X_Aggregor_Token, USER, FEED_NAME, 'reddit', '0.4', 'all'])
    .then((res) => {
        return Promise.resolve();
    });
})
.then(() => {
    return command(['add_plugin', X_Aggregor_Token, USER, FEED_NAME, 'reddit', '0.4', 'aww'])
    .then((res) => {
        plugin_id = res.data.id;
        return Promise.resolve();
    });
})
.then(() => {
    return command(['update_plugin', X_Aggregor_Token, USER, FEED_NAME, plugin_id, 'hackernews', '0.8', '']);
})
.then(() => {
    return command(['fetch_plugins', X_Aggregor_Token, USER, FEED_NAME])
    .then((res) => {
        console.log("plugins=", res.data.plugins);
        return Promise.resolve();
    });
})
.then(() => {
    return command(['fetch_feed', X_Aggregor_Token, USER, FEED_NAME, 1])
    .then((res) => {
        console.log("entries=", res.data.entries);
        console.log("errors=", res.data.errors);
        return Promise.resolve();
    });
})
.then(() => {
    return command(['fetch_feed', X_Aggregor_Token, USER, FEED_NAME, 2])
    .then((res) => {
        console.log("entries=", res.data.entries);
        console.log("errors=", res.data.errors);
        return Promise.resolve();
    });
})
.then(() => {
    return command(['delete_plugin', X_Aggregor_Token, USER, FEED_NAME, plugin_id]);
})
.then(() => {
    return command(['delete_feed', X_Aggregor_Token, USER, FEED_NAME]);
})
.then(() => {
    return command(['delete_user', X_Aggregor_Token, USER, PASS]);
})
.then(() => {
    console.log("Successfully used all routes");
})
.catch((err) => {
    console.error("\nERROR:", err);
});
