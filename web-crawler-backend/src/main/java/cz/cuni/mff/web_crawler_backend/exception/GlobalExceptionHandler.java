package cz.cuni.mff.web_crawler_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/**
 * Handles better printing of exceptions thrown by server.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Resolves exceptions raised due invalid fields
     *
     * @param ex Thrown exception
     * @return Response entity with information about code and scope of problem.
     */
    @ExceptionHandler(FieldValidationException.class)
    public ResponseEntity<ErrorResponse> handleFieldValidationException(FieldValidationException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                List.of(new ErrorDetail(ex.getCode(), ex.getField()))
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Resolves exceptions raised due internal server errors
     *
     * @param ex Thrown exception
     * @return Response entity with information about code and scope of problem.
     */
    @ExceptionHandler(InternalServerException.class)
    public ResponseEntity<ErrorResponse> handleInternalServerException(InternalServerException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                List.of(new ErrorDetail(ex.getCode(), ex.getField()))
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Resolves exceptions raised because element was not found
     *
     * @param ex Thrown exception
     * @return Response entity with information about code and scope of problem.
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                List.of(new ErrorDetail(ex.getCode(), ex.getField()))
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
}
