var GameRoomLogic = require("../serverscript/GameRoomLogic");
var should = require("should");

// GameRoomLogic
//
//	players
//	allClasses
//	availableClasses
//	currentPlayersState
//	currentFullState
//	isAllowedToJoin
//	addPlayerToGame
//

var iceJob = { job: "Ice" };
var fireJob = { job: "Fire" };
var gardeningJob = { job: "Gardener" };

var iceMan = {
	data: function() { return iceJob; }
};
var fireMan = {
	data: function() { return fireJob }
};		
var gardener = {
	data: function() { return gardeningJob }
};
	
describe('GameRoomLogic', function () {	
	
	var logic = GameRoomLogic();
	
	beforeEach(function() {
		logic = GameRoomLogic();
	});

	describe('players', function () {	
		it('should begin empty', function () {
			logic.players.should.eql([], "A player came from nowhere");
		});
	});
	
	describe('allClasses', function() {
		it('should have Ice, Fire, Earth and Gimp', function() {
			logic.allClasses.should.be.Array;
			logic.allClasses.should.containEql("Ice", "Doesn't have Ice");
			logic.allClasses.should.containEql("Fire", "Doesn't have Fire");
			logic.allClasses.should.containEql("Earth", "Doesn't have Earth");
			logic.allClasses.should.containEql("Gimp", "Doesn't have Gimp");
		});
	});
	
	describe('availableClasses', function() {
		it('should begin with all classes available', function() {
			logic.availableClasses().should.eql(logic.allClasses, "Wrong available classes");
		});
	});
	
	describe('isAllowedToJoin', function() {
		it('should not allow an invalid player', function() {
			logic.isAllowedToJoin(gardeningJob).should.equal(false, "Someone let the gardener in");
		});
		it('should allow valid players', function() {
			logic.isAllowedToJoin(iceJob).should.equal(true, "Ice player wasn't allowed in");
			logic.isAllowedToJoin(fireJob).should.equal(true, "Fire player wasn't allowed in");
		});
		it('should not allow the same player twice', function() {
			logic.addPlayerToGame(iceMan);
			logic.addPlayerToGame(fireMan);
			
			logic.isAllowedToJoin(iceJob).should.equal(false, "Ice player was allowed in twice");
			logic.isAllowedToJoin(fireJob).should.equal(false, "Fire player was allowed in twice");
		});
	});

});
