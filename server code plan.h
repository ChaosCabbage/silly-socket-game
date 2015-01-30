class GameRoom {
public:
	GameRoom(string roomName);

	void addNewPlayer(socket);
	// Adds the socket connection as a player. Socket is added to this room for broadcasting.
	//
	// Listens to 
	//
	//    "join game" : Send { class: "Ice" } to join as the Ice wizard.
	//                  Accepts one player each of "Ice", "Fire", "Earth"
	//                  Accepts any number of "Gimp"
	//                   
	//    "try move"  : Send { x: , y: }. These are absolute coordinates.
	//
	// Sends
	//    "joined lobby" : Sends 	{ 
	//									map: 	 [[1,1,1,1,1,1,1],
	//										  	  [1,0,0,0,0,0,1],
	//										       	    ...      ], 
	//									classes: [      ...      ], 
	//									players: [{ class: "Ice",  pos: {x1, y1} },
	//											  { class: "Fire", pos: {x2, y2} },
	//													      ...
	//											 ]
	//								}
	//
	//
	//    "joined game" : Sends with no data.
	//    "failed to join" : Sends { reason: "Class taken" } Tells this socket that your chosen class was already taken.

private:

	void broadcastPlayerPositions() const;
	// Broadcasts
	// 
	//   "position update" : Sends { players: [ { class: "Ice", pos: {x, y} } ] }
	//   to everyone in the room.
};



class Player {
public:
	Player(socket, classString, collisionMap);
	// Listens to 
	//                   
	//    "try move"  : Send { x: , y: }. These are absolute coordinates.

	Object positionData() const;
};
