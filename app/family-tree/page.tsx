'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    Position,
    Handle,
    ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { Plus, Edit2, Trash2, Link as LinkIcon, Calendar, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// --- Types ---
interface Person {
    _id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    deathDate?: string;
    isLiving: boolean;
    parents: string[];
    children: string[];
}

// --- Mock Data ---
const generateMockPeople = (): Person[] => {
    const people: Person[] = [];
    const surnames = ['Παπαδόπουλος', 'Γεωργίου', 'Ιωάννου', 'Δημητρίου', 'Νικολάου', 'Κωνσταντίνου'];
    const maleNames = ['Ιωάννης', 'Γεώργιος', 'Νικόλαος', 'Δημήτριος', 'Κωνσταντίνος', 'Ανδρέας', 'Βασίλειος'];
    const femaleNames = ['Ελένη', 'Μαρία', 'Αικατερίνη', 'Βασιλική', 'Αγγελική', 'Γεωργία', 'Δήμητρα'];

    // Create 3 main branches (roots)
    for (let i = 1; i <= 3; i++) {
        const isMale = Math.random() > 0.5;
        people.push({
            _id: `root-${i}`,
            firstName: isMale ? maleNames[Math.floor(Math.random() * maleNames.length)] : femaleNames[Math.floor(Math.random() * femaleNames.length)],
            lastName: surnames[Math.floor(Math.random() * surnames.length)] + (isMale ? '' : 'ου'),
            birthDate: (1850 + i * 20).toString(),
            deathDate: (1930 + i * 20).toString(),
            isLiving: false,
            parents: [],
            children: [],
        });
    }

    // Generate descendants
    let currentId = 6;
    const targetCount = 100;

    while (people.length < targetCount) {
        const parentIndex = Math.floor(Math.random() * (people.length * 0.7)); // Bias towards older generations
        const parent = people[parentIndex];

        if (parent.children.length < 4) {
            const parentBirth = parseInt(parent.birthDate);
            const birthDate = parentBirth + 25 + Math.floor(Math.random() * 10);
            const isLiving = birthDate > 1950 && Math.random() > 0.3;
            const isMale = Math.random() > 0.5;

            const newId = `p-${currentId++}`;
            const person: Person = {
                _id: newId,
                firstName: isMale ? maleNames[Math.floor(Math.random() * maleNames.length)] : femaleNames[Math.floor(Math.random() * femaleNames.length)],
                lastName: parent.lastName,
                birthDate: birthDate.toString(),
                deathDate: isLiving ? undefined : (birthDate + 70 + Math.floor(Math.random() * 15)).toString(),
                isLiving: isLiving,
                parents: [parent._id],
                children: [],
            };

            people.push(person);
            parent.children.push(newId);
        }

        if (currentId > 300) break;
    }

    return people;
};

const INITIAL_PEOPLE = generateMockPeople();

// --- Layout Logic ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: 'TB', marginx: 50, marginy: 50 }); // Top-Bottom layout

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 220, height: 100 }); // Approximate node size
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        // Center the node
        node.position = {
            x: nodeWithPosition.x - 110,
            y: nodeWithPosition.y - 50,
        };
    });

    return { nodes, edges };
};

// --- Custom Node Component ---
const FamilyNode = memo(({ data, isConnectable }: any) => {
    const { person, onEdit, onAddChild, onConnect, onDelete } = data;

    return (
        <div className="relative group w-[220px]">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="opacity-0" />
            <Card
                className="p-3 cursor-pointer hover:border-primary transition-all bg-card shadow-md hover:shadow-lg border-2"
                onClick={() => onEdit(person)}
            >
                <div className="space-y-1 text-center">
                    <h3 className="font-bold text-sm truncate">{person.firstName} {person.lastName}</h3>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{person.birthDate} – {person.isLiving ? '' : person.deathDate}</span>
                    </div>
                    {person.isLiving && <Badge variant="secondary" className="mt-1 bg-green-500/10 text-green-500 border-green-500/20 px-1 py-0 text-[10px]">Σήμερα</Badge>}
                </div>
            </Card>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-100 transition-opacity z-50 bg-background/80 backdrop-blur rounded-full p-0.5 shadow-sm border scale-75 hover:scale-100 origin-center">
                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-muted" onClick={(e) => { e.stopPropagation(); onAddChild(person); }}>
                    <Plus className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-muted text-primary" onClick={(e) => { e.stopPropagation(); onConnect(person); }}>
                    <LinkIcon className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-muted text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(person._id); }}>
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="opacity-0" />
        </div>
    );
});

const nodeTypes = {
    custom: FamilyNode,
};

// --- Main Page Component ---
export default function FamilyTreePage() {
    const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Modal states
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [newPerson, setNewPerson] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        deathDate: '',
        isLiving: true,
    });

    // --- Handlers ---
    const handleEdit = useCallback((person: Person) => {
        setSelectedPerson({ ...person }); // Create a copy so we modify modal state safely
        setIsEditModalOpen(true);
    }, []);

    const handleAddChild = useCallback((person: Person) => {
        setSelectedPerson(person);
        setNewPerson({
            firstName: '',
            lastName: person.lastName, // Suggest last name
            birthDate: '',
            deathDate: '',
            isLiving: true
        });
        setIsAddChildModalOpen(true);
    }, []);

    const handleConnect = useCallback((person: Person) => {
        setSelectedPerson(person);
        setIsConnectModalOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το άτομο και όλους τους απογόνους του;')) {
            setPeople((prev) => {
                // Remove person and update references
                const updated = prev.filter(p => p._id !== id).map(p => ({
                    ...p,
                    children: p.children.filter(cid => cid !== id),
                    parents: p.parents.filter(pid => pid !== id),
                }));
                return updated;
            });
        }
    }, []);

    // --- Update Graph when People Change ---
    useEffect(() => {
        if (people.length === 0) return;

        const newNodes: Node[] = people.map((person) => ({
            id: person._id,
            type: 'custom',
            data: {
                person,
                onEdit: handleEdit,
                onAddChild: handleAddChild,
                onConnect: handleConnect,
                onDelete: handleDelete
            },
            position: { x: 0, y: 0 }, // Initial position, updated by layout
        }));

        const newEdges: Edge[] = [];
        people.forEach((person) => {
            person.children.forEach((childId) => {
                // Verify child exists
                if (people.some(p => p._id === childId)) {
                    newEdges.push({
                        id: `${person._id}-${childId}`,
                        source: person._id,
                        target: childId,
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: 'var(--primary)', strokeWidth: 2 },
                    });
                }
            });
        });

        const layouted = getLayoutedElements(newNodes, newEdges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
    }, [people, handleEdit, handleAddChild, handleConnect, handleDelete, setNodes, setEdges]);


    // --- CRUD Actions ---
    const saveNewPerson = () => {
        const id = Math.random().toString(36).substr(2, 9);
        const person: Person = {
            ...newPerson,
            _id: id,
            parents: selectedPerson ? [selectedPerson._id] : [],
            children: [],
        };

        setPeople((prev) => {
            const updated = [...prev, person];
            if (selectedPerson) {
                // Update parent
                const parentIndex = updated.findIndex(p => p._id === selectedPerson._id);
                if (parentIndex !== -1) {
                    updated[parentIndex] = {
                        ...updated[parentIndex],
                        children: [...updated[parentIndex].children, id],
                    };
                }
            }
            return updated;
        });
        setIsAddChildModalOpen(false);
    };

    const saveEditPerson = () => {
        if (!selectedPerson) return;
        setPeople((prev) => prev.map(p => p._id === selectedPerson._id ? selectedPerson : p));
        setIsEditModalOpen(false);
    };

    const saveConnection = (targetId: string) => {
        if (!selectedPerson) return;

        // Connect selectedPerson (as parent) to targetId (as child)
        // Check for cycles? Let's assume user is careful for now or Dagre handles layout mess.
        setPeople((prev) => {
            return prev.map(p => {
                if (p._id === selectedPerson._id) {
                    return { ...p, children: [...p.children, targetId] }; // Add child
                }
                if (p._id === targetId) {
                    return { ...p, parents: [...p.parents, selectedPerson._id] }; // Add parent
                }
                return p;
            });
        });
        setIsConnectModalOpen(false);
    };

    return (
        <div className="h-[calc(100vh-5rem)] bg-muted/30 dark:bg-zinc-950 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-background/80 backdrop-blur-md border-b flex justify-between items-center z-10 shrink-0 h-16">
                <div>
                    <h1 className="text-lg md:text-xl font-serif font-bold text-primary">Γενεαλογικό Δέντρο</h1>
                    <p className="text-xs text-muted-foreground">{people.length} Άτομα</p>
                </div>
                <Button onClick={() => { setSelectedPerson(null); setNewPerson({ firstName: '', lastName: '', birthDate: '', deathDate: '', isLiving: true }); setIsAddChildModalOpen(true); }} size="sm">
                    <Plus className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Προσθήκη Ιδρυτή</span>
                </Button>
            </div>

            {/* React Flow Canvas */}
            <div className="flex-1 w-full h-full">
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        fitView
                        minZoom={0.1}
                        maxZoom={2}
                        attributionPosition="bottom-left"
                    >
                        <Controls />
                        <MiniMap
                            nodeColor="#B8860B"
                            maskColor="rgba(0, 0, 0, 0.1)"
                            className="bg-background border rounded-lg shadow-lg"
                        />
                        <Background gap={20} size={1} />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>

            {/* --- Modals (Reused Logic) --- */}
            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Επεξεργασία Προφίλ</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Όνομα</Label><Input value={selectedPerson?.firstName || ''} onChange={(e) => setSelectedPerson(prev => prev ? { ...prev, firstName: e.target.value } : null)} /></div>
                            <div className="space-y-2"><Label>Επώνυμο</Label><Input value={selectedPerson?.lastName || ''} onChange={(e) => setSelectedPerson(prev => prev ? { ...prev, lastName: e.target.value } : null)} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Έτος Γέννησης</Label><Input value={selectedPerson?.birthDate || ''} onChange={(e) => setSelectedPerson(prev => prev ? { ...prev, birthDate: e.target.value } : null)} /></div>
                            <div className="space-y-2"><Label>Έτος Θανάτου</Label><Input disabled={selectedPerson?.isLiving} value={selectedPerson?.deathDate || ''} onChange={(e) => setSelectedPerson(prev => prev ? { ...prev, deathDate: e.target.value } : null)} /></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={selectedPerson?.isLiving} onChange={(e) => setSelectedPerson(prev => prev ? { ...prev, isLiving: e.target.checked } : null)} />
                            <Label>Εν Ζωή</Label>
                        </div>
                    </div>
                    <DialogFooter><Button onClick={saveEditPerson}>Αποθήκευση</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Child Modal */}
            <Dialog open={isAddChildModalOpen} onOpenChange={setIsAddChildModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{selectedPerson ? `Προσθήκη Τέκνου` : 'Προσθήκη Ιδρυτή'}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Όνομα</Label><Input value={newPerson.firstName} onChange={(e) => setNewPerson({ ...newPerson, firstName: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Επώνυμο</Label><Input value={newPerson.lastName} onChange={(e) => setNewPerson({ ...newPerson, lastName: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Έτος Γέννησης</Label><Input value={newPerson.birthDate} onChange={(e) => setNewPerson({ ...newPerson, birthDate: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Έτος Θανάτου</Label><Input disabled={newPerson.isLiving} value={newPerson.deathDate} onChange={(e) => setNewPerson({ ...newPerson, deathDate: e.target.value })} /></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={newPerson.isLiving} onChange={(e) => setNewPerson({ ...newPerson, isLiving: e.target.checked })} />
                            <Label>Εν Ζωή</Label>
                        </div>
                    </div>
                    <DialogFooter><Button onClick={saveNewPerson}>Προσθήκη</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Connect Modal */}
            <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Σύνδεση με Υπάρχον Προφίλ</DialogTitle>
                        <DialogDescription>Επιλέξτε παιδί για τον/την {selectedPerson?.firstName}</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[300px] overflow-y-auto space-y-2 p-2">
                        {people
                            .filter(p => !p.parents.includes(selectedPerson?._id || '') && p._id !== selectedPerson?._id)
                            .map(p => (
                                <Button key={p._id} variant="outline" className="w-full justify-start" onClick={() => saveConnection(p._id)}>
                                    {p.firstName} {p.lastName} ({p.birthDate})
                                </Button>
                            ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
