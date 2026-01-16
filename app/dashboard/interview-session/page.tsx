'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar';
import {
    Camera, CameraOff, Mic, MicOff, PhoneOff, Video, VideoOff,
    Settings2, MessageSquare, Clock, Pause, Play, SkipForward
} from 'lucide-react';

// Wrapper component to handle Suspense boundary for useSearchParams
export default function InterviewSessionPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}><div className="text-white">Loading...</div></div>}>
            <InterviewSessionContent />
        </Suspense>
    );
}

function InterviewSessionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionType = searchParams.get('type') || 'technical';

    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isStarted, setIsStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timer, setTimer] = useState(0);

    const questions = {
        technical: [
            "Tell me about a challenging technical problem you solved recently.",
            "How would you design a scalable REST API?",
            "Explain the difference between SQL and NoSQL databases.",
            "What is your approach to debugging production issues?",
            "Describe your experience with React hooks."
        ],
        behavioral: [
            "Tell me about yourself.",
            "Describe a time when you had to work with a difficult team member.",
            "How do you handle tight deadlines?",
            "Give an example of when you showed leadership.",
            "Why are you interested in this role?"
        ],
        hr: [
            "What are your salary expectations?",
            "Why are you leaving your current job?",
            "Where do you see yourself in 5 years?",
            "What motivates you at work?",
            "Do you have any questions for us?"
        ]
    };

    const currentQuestions = questions[sessionType as keyof typeof questions] || questions.technical;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isStarted && !isPaused) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isStarted, isPaused]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const requestCameraPermission = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setStream(mediaStream);
            setHasPermission(true);
            setIsCameraOn(true);
            setIsMicOn(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setHasPermission(false);
            setError('Camera access denied. Please allow camera access.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCamera = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOn(videoTrack.enabled);
            }
        }
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            }
        }
    };

    const startInterview = () => {
        setIsStarted(true);
        setCurrentQuestion(0);
        setTimer(0);
    };

    const nextQuestion = () => {
        if (currentQuestion < currentQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            endInterview();
        }
    };

    const endInterview = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOn(false);
        setIsMicOn(false);
        setHasPermission(null);
        setIsStarted(false);
        router.push('/dashboard/feedback');
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 p-8 space-y-6 overflow-y-auto">
                <TopBar />

                {/* Session Header */}
                <div className="flex items-center justify-between rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div>
                        <h1 className="text-xl font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                            {sessionType} Interview Session
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Question {currentQuestion + 1} of {currentQuestions.length}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <Clock size={18} style={{ color: 'var(--text-muted)' }} />
                            <span className="font-mono text-lg" style={{ color: 'var(--text-primary)' }}>{formatTime(timer)}</span>
                        </div>
                        <button
                            onClick={endInterview}
                            className="px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: '#ef4444' }}
                        >
                            End Session
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Video Area */}
                    <div className="col-span-2 rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="relative aspect-video bg-black flex items-center justify-center">
                            {!hasPermission && !isLoading && (
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                                        <Camera size={40} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Enable Camera</h3>
                                    <p className="text-gray-400 mb-6">Allow camera access to start your interview</p>
                                    <button
                                        onClick={requestCameraPermission}
                                        className="px-6 py-3 rounded-lg text-white font-medium"
                                        style={{ background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)' }}
                                    >
                                        Allow Camera Access
                                    </button>
                                    {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
                                </div>
                            )}

                            {isLoading && (
                                <div className="text-center">
                                    <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-400">Requesting camera access...</p>
                                </div>
                            )}

                            {hasPermission && (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                    style={{ transform: 'scaleX(-1)' }}
                                />
                            )}

                            {hasPermission && !isCameraOn && (
                                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                                    <CameraOff size={48} className="text-gray-500" />
                                </div>
                            )}
                        </div>

                        {hasPermission && (
                            <div className="p-4 flex items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <button
                                    onClick={toggleMic}
                                    className={`p-4 rounded-full transition ${isMicOn ? 'bg-gray-700' : 'bg-red-500'}`}
                                >
                                    {isMicOn ? <Mic size={24} className="text-white" /> : <MicOff size={24} className="text-white" />}
                                </button>
                                <button
                                    onClick={toggleCamera}
                                    className={`p-4 rounded-full transition ${isCameraOn ? 'bg-gray-700' : 'bg-red-500'}`}
                                >
                                    {isCameraOn ? <Video size={24} className="text-white" /> : <VideoOff size={24} className="text-white" />}
                                </button>
                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className="p-4 rounded-full bg-gray-700"
                                >
                                    {isPaused ? <Play size={24} className="text-white" /> : <Pause size={24} className="text-white" />}
                                </button>
                                <button
                                    onClick={endInterview}
                                    className="p-4 rounded-full bg-red-500"
                                >
                                    <PhoneOff size={24} className="text-white" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Question Panel */}
                    <div className="space-y-4">
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare size={20} style={{ color: '#3b82f6' }} />
                                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Current Question</h3>
                            </div>
                            <p className="text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                                {isStarted ? currentQuestions[currentQuestion] : 'Click "Start Interview" when ready'}
                            </p>

                            {hasPermission && !isStarted && (
                                <button
                                    onClick={startInterview}
                                    className="w-full py-3 rounded-lg text-white font-medium"
                                    style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                                >
                                    Start Interview
                                </button>
                            )}

                            {isStarted && (
                                <button
                                    onClick={nextQuestion}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-medium"
                                    style={{ backgroundColor: '#10b981' }}
                                >
                                    <SkipForward size={18} />
                                    {currentQuestion < currentQuestions.length - 1 ? 'Next Question' : 'Finish Interview'}
                                </button>
                            )}
                        </div>

                        {/* Progress */}
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Progress</h3>
                            <div className="space-y-2">
                                {currentQuestions.map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: i < currentQuestion ? '#10b981' : i === currentQuestion ? '#3b82f6' : 'var(--bg-tertiary)'
                                            }}
                                        />
                                        <span className="text-sm" style={{
                                            color: i <= currentQuestion ? 'var(--text-primary)' : 'var(--text-muted)'
                                        }}>
                                            Question {i + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Tips</h3>
                            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <li>• Maintain eye contact with the camera</li>
                                <li>• Speak clearly at a moderate pace</li>
                                <li>• Take a moment to think before answering</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
