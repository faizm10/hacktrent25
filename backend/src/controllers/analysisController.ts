import { Request, Response } from 'express';
import { analyzeSessionWithGemini, AnalysisRequest } from '../services/analysisService';

export class AnalysisController {
  async analyzeSession(req: Request, res: Response): Promise<void> {
    try {
      const { transcript, duration, wordCount, averagePause, wordsPerMinute } = req.body;

      // Enhanced validation
      if (!transcript || typeof transcript !== 'string') {
        res.status(400).json({ 
          error: 'Valid transcript is required',
          details: 'Transcript must be a non-empty string'
        });
        return;
      }

      if (transcript.trim().length < 5) {
        res.status(400).json({
          error: 'Transcript too short',
          details: 'Transcript must contain at least 5 characters for meaningful analysis'
        });
        return;
      }

      // Validate numerical values with defaults
      const analysisRequest: AnalysisRequest = {
        transcript: transcript.trim(),
        duration: Math.max(0, Number(duration) || 0),
        wordCount: Math.max(0, Number(wordCount) || 0),
        averagePause: Math.max(0, Number(averagePause) || 0),
        wordsPerMinute: Math.max(0, Number(wordsPerMinute) || 0),
      };

      console.log('Analyzing session:', {
        transcriptLength: analysisRequest.transcript.length,
        wordCount: analysisRequest.wordCount,
        duration: analysisRequest.duration
      });

      const analysis = await analyzeSessionWithGemini(analysisRequest);

      // Log successful analysis
      console.log('Analysis completed successfully:', {
        clarityScore: analysis.clarityScore,
        pronunciationScore: analysis.pronunciationScore,
        fluencyScore: analysis.fluencyScore
      });

      res.json({
        success: true,
        data: analysis,
        metadata: {
          transcriptLength: analysisRequest.transcript.length,
          analyzedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Analysis controller error:', error);
      
      // More specific error handling
      if (error instanceof SyntaxError) {
        res.status(500).json({
          error: 'Invalid response from AI service',
          message: 'The analysis service returned malformed data'
        });
        return;
      }

      if (error instanceof Error && error.message.includes('API key')) {
        res.status(500).json({
          error: 'Service configuration error',
          message: 'Analysis service is not properly configured'
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to analyze session',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        retryable: true
      });
    }
  }

  // Health check endpoint
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'healthy',
      service: 'session-analysis',
      timestamp: new Date().toISOString(),
      geminiConfigured: !!process.env.GEMINI_API_KEY
    });
  }
}