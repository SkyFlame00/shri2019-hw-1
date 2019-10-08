const chai = require('chai');
const request = require('supertest');
const axios = require('axios');
const AdmZip = require('adm-zip');
const expect = chai.expect;

const createAppInstance = require('../app');
const mountRoutes = require('../routes');
const helpers = require('../helpers');

const createServerInstance = (app, path, port) => {
  mountRoutes(
    app,
    {
      REPOS_PATH: path,
      MAIN_BRANCH: 'master'
    },
    helpers
  );

  return app.listen(port);
}

const app = createAppInstance();
const app2 = createAppInstance();

let serverInstance, serverInstance2;

const serverInstanceUrl = 'http://localhost:9001';
const serverInstance2Url = 'http://localhost:9002';

describe('API methods', function() {

  before(function() {
    serverInstance = createServerInstance(app, './test/repos', 9001);
    serverInstance2 = createServerInstance(app2, './test/SURELY-DOES-NOT-EXIST', 9002);
  });

  after(function() {
    serverInstance.close();
    serverInstance2.close();
  });

  context('GET /api/repos', function() {
    it('Provided path is incorrect (i.e. directory does not exist)', function(done) {
      request(serverInstance2)
        .get('/api/repos')
        .expect('Content-Type', /json/)
        .expect(404, {
          error: true,
          message: 'Provided directory does not exist'
        }, done);
    });
  
    it('Retrieve correct repos list', function(done) {
      request(serverInstance)
        .get('/api/repos')
        .expect('Content-Type', /json/)
        .expect(200, ['testRepo'], done);
    });
  });

  context('POST /api/repos', function() {
    it('Clone new repository to the repositories folder', function(done) {
      request(serverInstance)
        .post('/api/repos')
        .send({ url: `${__dirname}/repos/innerRepo/testRepo2` })
        .expect(200)
        .end(() => {
          axios
            .delete(`${serverInstanceUrl}/api/repos/testRepo2`)
            .then(() => done());
        });
    });
  
    it('Get an error when trying to clone repository with the name that is already taken', function(done) {
      const test = () => {
        request(serverInstance)
          .post('/api/repos')
          .send({ url: `${__dirname}/repos/innerRepo/testRepo2` })
          .expect('Content-Type', /json/)
          .expect(404, {
            error: true,
            message: 'fatal: destination path \'testRepo2\' already exists and is not an empty directory.'
          })
          .end(() => {
            axios
              .delete(`${serverInstanceUrl}/api/repos/testRepo2`)
              .then(() => done());
          });
      }
      
      axios
        .post(`${serverInstanceUrl}/api/repos`, { url: `${__dirname}/repos/innerRepo/testRepo2` })
        .then(test);
    });
  });

  context('GET /api/repos/:repositoryId', function() {
    it('Retrieve correct files list', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo')
        .expect('Content-Type', /json/)
        .expect(200, [{
          isDir: false,
          fileName: 'file1.txt'
        }, {
          isDir: false,
          fileName: 'file2.txt'
        }], done);
    });
  
    it('Get an error when repository provided does not exist', function(done) {
      request(serverInstance)
        .get('/api/repos/SOME-UNKNOWN-REPO')
        .expect('Content-Type', /json/)
        .expect(404, {
          error: true,
          message: 'Specified repository does not exist in this directory'
        }, done);
    });
  });

  context('DELETE /api/repos/:repositoryId', function() {
    it('Successfully remove repository', function(done) {
      const test = () => {
        request(serverInstance)
          .delete('/api/repos/testRepo2')
          .expect(200, done);
      }
  
      axios
        .post(`${serverInstanceUrl}/api/repos`, { url: `${__dirname}/repos/innerRepo/testRepo2` })
        .then(test);
    });
  
    it('Get an error when trying to remove not existing repository', function(done) {
      request(serverInstance)
        .delete('/api/repos/testRepo2')
        .expect('Content-Type', /json/)
        .expect(404, {
          error: true,
          message: 'Specified repository does not exist in this directory'
        }, done);
    });
  });

  context('GET /api/repos/:repositoryId/tree', function() {
    it('Get an error because commit hash was not specified', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/tree')
        .expect('Content-Type', /json/)
        .expect(404, {
          error: true,
          message: 'You did not provide the branch name'
        }, done);
    });
  });

  context('GET /api/repos/:repositoryId/tree/:commitHash', function() {
    it('Retrieve correct files list', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/tree/newBranch')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          const files = [{
            isDir: false,
            fileName: 'file1.txt'
          }, {
            isDir: false,
            fileName: 'file2.txt'
          }, {
            isDir: false,
            fileName: 'file3.txt'
          }, {
            isDir: true,
            fileName: 'new'
          }];
  
          expect(res.body).to.be.deep.equal(files);
  
          done();
        });
    });
  
    it('Get an error because commit hash specified does not exist', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/tree/nothing')
        .expect('Content-Type', /json/)
        .expect(404, {
          error: true,
          message: 'Command failed: git ls-tree nothing --full-name\nfatal: Not a valid object name nothing\n'
        }, done);
    });
  });

  context('GET /api/repos/:repositoryId/tree/:commitHash/:path([^ ]+)', function() {
    it('Get correct files list', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/tree/newBranch/new')
        .expect('Content-Type', /json/)
        .expect(200, [{
          isDir: false,
          fileName: 'new.txt'
        }], done);
    });
  
    it('Get an error because commit hash specified does not exist', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/tree/WEIRD_BRANCH/new')
        .expect('Content-Type', /json/)
        .expect(404, {
          error: true,
          message: 'Command failed: git ls-tree --full-name WEIRD_BRANCH:new/\nfatal: Not a valid object name WEIRD_BRANCH:new/\n'
        }, done);
    });
  
    it('Get an error because path specified is not valid', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/tree/newBranch/NOWHERE')
        .expect('Content-Type', /json/)
        .expect(404, {
          error: true,
          message: 'Command failed: git ls-tree --full-name newBranch:NOWHERE/\nfatal: Not a valid object name newBranch:NOWHERE/\n'
        }, done);
    });
  });

  context('GET /api/repos/:repositoryId/blob/:commitHash/:path([^ ]+)', function() {
    it('Get correct content', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/blob/newBranch/file1.txt')
        .expect(200, 'hello world', done);
    });
  
    it('Get an error because commit hash specified does not exist', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/blob/WEIRD_BRANCH/file1.txt')
        .expect('Content-Type', /json/)
        .expect(404, {
          error: true,
          message: 'fatal: Invalid object name \'WEIRD_BRANCH\'.\n'
        }, done);
    });
  
    it('Get an error because path specified is not valid', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/blob/newBranch/WEIRD_FILE.txt')
        .expect('Content-Type', /json/)
        .expect(404, {
          error: true,
          message: 'fatal: Path \'WEIRD_FILE.txt\' does not exist in \'newBranch\'\n'
        }, done);
    });
  });

  context('GET /api/repos/:repositoryId/commits/:commitHash/diff', function() {
    it('Get correct diff', function(done) {
      const diff =
        'hello world added\n\n\n' + 
        'diff --git a/file1.txt b/file1.txt\n' +
        'index e69de29..95d09f2 100644\n' +
        '--- a/file1.txt\n' +
        '+++ b/file1.txt\n' +
        '@@ -0,0 +1 @@\n' +
        '+hello world\n' +
        '\\ No newline at end of file\n'
      
      request(serverInstance)
        .get('/api/repos/testRepo/commits/newBranch/diff')
        .expect(200, diff, done);
    });
  
    it('Get an error because commit hash specified does not exist', function(done) {
      request(serverInstance)
        .get('/api/repos/testRepo/commits/WEIRD_BRANCH/diff')
        .expect(404, {
          error: true,
          message: 'fatal: bad revision \'WEIRD_BRANCH\'\n'
        }, done);
    });
  });

});