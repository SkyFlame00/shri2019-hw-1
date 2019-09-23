;(function(global) {
  global.Promise = QPromise;

  var STATES = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
  };

  function QPromise(executor) {
    this.state = STATES.PENDING;
    this.handlers = [];
    
    var self = this;

    executor(
      function(value) {
        self.resolve(value);
      },
      function(error) {
        self.reject(error);
      }
    );
  }

  QPromise.prototype.resolve = function(value) {
    this.state = STATES.FULFILLED;
    this.value = value;

    for (var i = 0; i < this.handlers.length; i++) {
      try {
        value instanceof QPromise
          ? value.then(this.handlers[i].resolver)
          : this.handlers[i].resolver(value);
      }
      catch(e) {
        this.handlers[i].rejecter(value);
      }
    }
  }
  
  QPromise.prototype.reject = function(error) {
    this.state = STATES.REJECTED;
    this.error = error;

    for (var i = 0; i < this.handlers.length; i++) {
      this.handlers[i].rejecter(error);
    }
  }

  QPromise.prototype.then = function(onFulfilled, onRejected) {
    var self = this;

    switch(self.state) {
      case STATES.PENDING:
        return new QPromise(function(resolve, reject) {
          self.handlers.push({
            resolver: function(value) {
              resolve(onFulfilled(value));
            },
            rejecter: function(value) {
              if (!onRejected) { reject(value); }
              else reject(onRejected(value));
            }
          });
        });
      case STATES.FULFILLED:
        return new QPromise(function(resolve, reject) {
          try {
            self.value instanceof QPromise
              ? self.value.then(function(value) { resolve(onFulfilled(value)); })
              : resolve(onFulfilled(self.value));
          }
          catch(e) {
            reject(e)
          }
        });
      case STATES.REJECTED:
        return new QPromise(function(_, reject) {
          if (!onRejected) { reject(self.error); }
          else reject(onRejected(self.error));
        });
    }
  }
}(window || global));