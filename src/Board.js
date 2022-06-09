// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var count = 0;

      for (var i = 0; i < row.length; i++) {
        if (row[i] === 1) {
          count++
        }
      }

      if (count > 1) {
        return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var n = this.get('n');
      for (var i = 0; i < n; i++) {
        if (this.hasRowConflictAt(i) === true) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var board = this.rows();
      var count = 0;
      for (var i = 0; i < board.length; i++) {
        if (board[i][colIndex] === 1) {
          count++
        }
      }
      if (count > 1) {
        return true;
      }
      return false;
    },

    hasAnyColConflicts: function() {
        var n = this.get('n');
        for (var i = 0; i < n; i++) {
          if (this.hasColConflictAt(i)) {
            return true;
          }
        }
        return false;
      },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var board = this.rows();  // Get full board matrix
      var count = 0; // simple counter

      for (var i = 0; i < board.length; i++) { // iterate to find the row index
        for (var k = majorDiagonalColumnIndexAtFirstRow; k < board.length; k++) { // iterate again to get the column index. Starts at passed in column index because it is impossible to have a major diagonal that is left at that start index.
          // use both row and column index on board to find if the value is '1'
          // compare 1's location to firstrowindex and see if it matches, if it does its a conflict
          if (board[i][k] === 1 && this._getFirstRowColumnIndexForMajorDiagonalOn(i, k) === majorDiagonalColumnIndexAtFirstRow) {
            // Finds index that it would caluclate to on first row for the diagonal, even if outside of bounds.
            count++;
            // if found adds to count
            if (count > 1) {
              return true
            }
          }
        }
      }
      return false;
    },

   // _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
  //    return colIndex - rowIndex;
  //  },


    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var board = this.rows(); //Board to use for iterating
      var n = this.get('n'); // n needed to determine board size

      for (var i = 1 - n; i < board.length; i++) {
        // iterate over board. Because we are looking for corresponding first row index, it has to start left of board.
        if (this.hasMajorDiagonalConflictAt(i) === true) {
          // if MajorDiag function has conflict
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      // Same as Major but other direction.
      var board = this.rows();
      var count = 0;

      for (var i = 0; i < board.length; i++) {
        for (var k = 0; k <= minorDiagonalColumnIndexAtFirstRow; k++) {
          if (board[i][k] === 1 && this._getFirstRowColumnIndexForMinorDiagonalOn(i, k) === minorDiagonalColumnIndexAtFirstRow) {
            count++;
            if (count > 1) {
              return true
            }
          }
        }
      }
      return false;
    },

   // _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
  //    return colIndex + rowIndex;
  //  },



    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var board = this.rows();
      var n = this.get('n');

      for (var i = 0; i < (board.length + n); i++) {

        if (this.hasMinorDiagonalConflictAt(i) === true) {
          return true;
        }
      }
      return false;
    },


    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
